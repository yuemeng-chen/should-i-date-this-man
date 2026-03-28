/**
 * Fetches a URL via Jina Reader (r.jina.ai) which returns clean markdown text.
 * Works for LinkedIn and other login-walled pages better than direct fetch.
 */
async function fetchViaJina(url: string): Promise<string | null> {
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(jinaUrl, {
      headers: {
        "Accept": "text/plain",
        "X-Return-Format": "text",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return null;
    const text = await res.text();

    // If Jina returned a login wall page, the content will mention signing in
    if (
      text.includes("Join now to see") ||
      text.includes("Sign in to view") ||
      text.includes("authwall") ||
      text.length < 200
    ) {
      return null;
    }

    return text.slice(0, 5000);
  } catch {
    return null;
  }
}

/**
 * Attempts to fetch a URL and extract readable text content.
 * Tries direct fetch first, then falls back to Jina Reader.
 */
export async function fetchUrlContent(url: string): Promise<{ text: string; blocked: boolean } | null> {
  // Try Jina Reader first — handles LinkedIn and other protected pages well
  const jinaText = await fetchViaJina(url);
  if (jinaText) {
    return { text: jinaText, blocked: false };
  }

  // Fallback: direct fetch for open pages
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });

    const html = await res.text();

    const isBlocked =
      html.includes("authwall") ||
      (html.includes("login") && html.includes("redirect")) ||
      (html.includes("sign-in") && html.length < 5000) ||
      res.url.includes("login") ||
      res.url.includes("authwall");

    if (isBlocked) {
      return { text: "", blocked: true };
    }

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 4000);

    return { text, blocked: false };
  } catch {
    return { text: "", blocked: true };
  }
}

/**
 * Extracts URLs from a block of text.
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s"'<>)]+/g;
  return [...new Set(text.match(urlRegex) ?? [])].slice(0, 3);
}
