import { ImageResponse } from "next/og";
import { getReportBySlug } from "@/lib/supabase";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function getScoreColor(score: number): string {
  if (score >= 80) return "#2E7D32";
  if (score >= 50) return "#E65100";
  if (score >= 35) return "#C40060";
  return "#8B0000";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "LOCK HIM DOWN";
  if (score >= 80) return "SLAY";
  if (score >= 65) return "HE'S AIGHT";
  if (score >= 50) return "MID";
  if (score >= 35) return "ICK";
  if (score >= 20) return "TOXIC";
  return "RUN";
}

export default async function OGImage({
  params,
}: {
  params: { slug: string };
}) {
  const report = await getReportBySlug(params.slug);

  const score = report?.dateabilityScore ?? 0;
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const archetype = report?.archetypeLabel ?? "";

  // Read the hero OG image as base64 background
  const ogPath = join(process.cwd(), "public", "og.png");
  const ogBuffer = await readFile(ogPath);
  const ogBase64 = `data:image/png;base64,${ogBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Background — hero image */}
        <img
          src={ogBase64}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />

        {/* Dark overlay for readability */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        />

        {/* Score overlay — bottom right */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            bottom: 40,
            right: 48,
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: 20,
            padding: "24px 36px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 900,
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {score}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                color: "#999",
                lineHeight: 1,
              }}
            >
              /100
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 800,
              color: scoreColor,
              letterSpacing: 2,
              marginTop: 4,
            }}
          >
            {scoreLabel}
          </div>
          {archetype && (
            <div
              style={{
                display: "flex",
                fontSize: 16,
                color: "#666",
                marginTop: 8,
              }}
            >
              {archetype}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
