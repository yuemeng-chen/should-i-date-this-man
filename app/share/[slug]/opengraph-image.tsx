import { ImageResponse } from "next/og";
import { getReportBySlug } from "@/lib/supabase";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function getStamp(score: number): { label: string; color: string } {
  if (score < 45) return { label: "RUN", color: "#C40060" };
  if (score < 70) return { label: "RISKY", color: "#E65100" };
  return { label: "SLAY", color: "#2E7D32" };
}

export default async function OGImage({
  params,
}: {
  params: { slug: string };
}) {
  const report = await getReportBySlug(params.slug);

  const score = report?.dateabilityScore ?? 0;
  const stamp = getStamp(score);
  const archetype = report?.archetypeLabel ?? "";
  const verdict = report?.verdict ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#E8779A",
          padding: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: 24,
          }}
        >
          Should I Date This Man?
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 120,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 700,
              color: "#FFFFFF",
              backgroundColor: stamp.color,
              padding: "8px 24px",
              borderRadius: 12,
              lineHeight: 1.2,
            }}
          >
            {stamp.label}
          </div>
        </div>

        {archetype && (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              color: "#FFFFFF",
              marginBottom: 12,
              opacity: 0.9,
            }}
          >
            {archetype}
          </div>
        )}

        {verdict && (
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#FFFFFF",
              textAlign: "center",
              maxWidth: 900,
              opacity: 0.85,
              marginBottom: 24,
              lineHeight: 1.4,
            }}
          >
            {verdict.length > 150 ? verdict.slice(0, 147) + "..." : verdict}
          </div>
        )}

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#FFFFFF",
            opacity: 0.7,
            position: "absolute",
            bottom: 32,
          }}
        >
          shouldidatethisman.com
        </div>
      </div>
    ),
    { ...size }
  );
}
