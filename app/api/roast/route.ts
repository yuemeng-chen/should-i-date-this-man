import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { ROAST_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/system-prompt";
import { saveReport } from "@/lib/supabase";
import { fetchUrlContent, extractUrls } from "@/lib/fetch-url";
import { DatingAuditReport, RoastRequest } from "@/types";

// --- In-memory rate limiter ---
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;

const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, ip) => {
    if (now - entry.firstRequest > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  });
}, 5 * 60 * 1000);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  // Rate limit check
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      {
        error:
          "Slow down, girl! You've roasted 5 profiles in 10 minutes. Either you're speed-dating or you need to touch grass. Try again later. 💅",
      },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as RoastRequest;
    const { profileType, profileUrl, profileText, imageBase64, imageBase64s } =
      body;

    // Support both single image (legacy) and multiple images
    const images: string[] = imageBase64s ?? (imageBase64 ? [imageBase64] : []);

    if (!profileText && !profileUrl && images.length === 0) {
      return NextResponse.json(
        { error: "Please provide profile text, URL, or an image to roast." },
        { status: 400 }
      );
    }

    // Build message content
    type ContentBlock =
      | { type: "text"; text: string }
      | {
          type: "image";
          source: {
            type: "base64";
            media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
            data: string;
          };
        };

    const content: ContentBlock[] = [];

    // Add all images
    for (const img of images) {
      let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" = "image/jpeg";
      let base64Data = img;

      if (img.startsWith("data:")) {
        const [header, data] = img.split(",");
        base64Data = data;
        const mime = header.split(":")[1].split(";")[0];
        if (mime === "image/png" || mime === "image/gif" || mime === "image/webp") {
          mediaType = mime;
        }
      }

      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data: base64Data,
        },
      });
    }

    // Try to fetch any URLs found in the pasted text
    let fetchedContent = "";
    let allUrlsBlocked = false;
    const urlsToFetch = [
      ...(profileUrl ? [profileUrl] : []),
      ...(profileText ? extractUrls(profileText) : []),
    ];

    if (urlsToFetch.length > 0) {
      let anyFetched = false;
      let allBlocked = true;

      for (const url of urlsToFetch) {
        const result = await fetchUrlContent(url);
        if (result && !result.blocked && result.text.length > 100) {
          fetchedContent += `\n\n[Fetched from ${url}]:\n${result.text}`;
          anyFetched = true;
          allBlocked = false;
        } else if (result?.blocked) {
          fetchedContent += `\n\n[Note: ${url} is behind a login wall — could not fetch content.]`;
        } else {
          allBlocked = false; // unreachable, not blocked, just failed
        }
      }

      // If every URL was blocked AND no text/images beyond the URL itself
      const hasRealText = profileText && profileText.replace(/https?:\/\/[^\s]+/g, "").trim().length > 20;
      if (allBlocked && !anyFetched && !hasRealText && images.length === 0) {
        allUrlsBlocked = true;
      }
    }

    if (allUrlsBlocked) {
      return NextResponse.json(
        { error: "We can't read that link bestie 🔒 Screenshot his profile and upload it instead, or copy-paste his bio text directly." },
        { status: 400 }
      );
    }

    // Add text prompt
    const userPrompt = buildUserPrompt(
      profileType,
      profileUrl,
      profileText ? profileText + fetchedContent : fetchedContent || undefined
    );
    content.push({ type: "text", text: userPrompt });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: ROAST_SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    // Extract text from response
    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");

    // Parse JSON response
    let report: DatingAuditReport;
    try {
      // Claude might wrap in code blocks sometimes — strip them
      const cleaned = rawText
        .replace(/^```json\n?/m, "")
        .replace(/^```\n?/m, "")
        .replace(/\n?```$/m, "")
        .trim();
      report = JSON.parse(cleaned) as DatingAuditReport;

      // Strip height audit if the input didn't mention height
      const inputText = (profileText ?? "") + fetchedContent;
      const mentionsHeight = /\b\d['′']\s*\d{1,2}["″"]?|\b\d\s*(?:ft|feet|foot)\b|\bcm\b|\b(?:5|6|7)['′']\b/i.test(inputText);
      if (!mentionsHeight) {
        delete report.heightAudit;
      }
    } catch {
      console.error("Failed to parse Claude response:", rawText);
      return NextResponse.json(
        {
          error:
            "The AI had a moment. Even dating coaches need a break. Please try again!",
        },
        { status: 500 }
      );
    }

    // Save to Supabase (non-blocking, best effort)
    const saved = await saveReport(body, report);

    return NextResponse.json({
      report,
      shareSlug: saved?.shareSlug,
    });
  } catch (error) {
    console.error("Roast API error:", error);

    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Too many audits at once! Even love has limits. Try again in a moment." },
        { status: 429 }
      );
    }

    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "API key issue. Check your ANTHROPIC_API_KEY environment variable." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. The dating gods are not cooperating today." },
      { status: 500 }
    );
  }
}
