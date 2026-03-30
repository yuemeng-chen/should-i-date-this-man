import { DatingAuditReport, RoastRequest } from "@/types";

// Lightweight Supabase client — only used when env vars are set
// Falls back gracefully if Supabase is not configured

interface SupabaseReport {
  id: string;
  share_slug: string;
  created_at: string;
  profile_type: string;
  dateability_score: number;
  verdict: string;
  archetype_label: string;
  roast_summary: string;
  funny_one_liner: string;
  shareable_caption: string;
  red_flags: DatingAuditReport["redFlags"];
  green_flags: DatingAuditReport["greenFlags"];
  linkedin_translations: DatingAuditReport["linkedInTranslations"];
  height_audit: DatingAuditReport["heightAudit"];
}

function getSupabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
}

function getSupabaseKey(): string | null {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    null
  );
}

export function isSupabaseConfigured(): boolean {
  return !!(getSupabaseUrl() && getSupabaseKey());
}

async function supabaseRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!url || !key) {
    throw new Error("Supabase not configured");
  }

  const response = await fetch(`${url}/rest/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=representation",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${error}`);
  }

  return response.json() as T;
}

export async function saveReport(
  request: RoastRequest,
  report: DatingAuditReport
): Promise<{ id: string; shareSlug: string } | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    // Generate a random slug
    const shareSlug = Math.random().toString(36).substring(2, 10);

    const [saved] = await supabaseRequest<SupabaseReport[]>("/audit_reports", {
      method: "POST",
      body: JSON.stringify({
        profile_type: request.profileType,
        profile_url: request.profileUrl,
        dateability_score: report.dateabilityScore,
        verdict: report.verdict,
        archetype_label: report.archetypeLabel,
        roast_summary: report.roastSummary,
        funny_one_liner: report.funnyOneLiner,
        shareable_caption: report.shareableCaption,
        red_flags: report.redFlags,
        green_flags: report.greenFlags,
        linkedin_translations: report.linkedInTranslations,
        height_audit: report.heightAudit,
        share_slug: shareSlug,
      }),
    });

    return { id: saved.id, shareSlug: saved.share_slug };
  } catch (error) {
    console.error("Failed to save report to Supabase:", error);
    return null;
  }
}

export async function getReportBySlug(
  slug: string
): Promise<DatingAuditReport | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const reports = await supabaseRequest<SupabaseReport[]>(
      `/audit_reports?share_slug=eq.${slug}&limit=1`
    );

    if (!reports.length) return null;

    const r = reports[0];
    return {
      dateabilityScore: r.dateability_score,
      verdict: r.verdict,
      archetypeLabel: r.archetype_label,
      roastSummary: r.roast_summary,
      funnyOneLiner: r.funny_one_liner,
      shareableCaption: r.shareable_caption,
      redFlags: r.red_flags,
      greenFlags: r.green_flags,
      linkedInTranslations: r.linkedin_translations,
      heightAudit: r.height_audit,
    };
  } catch (error) {
    console.error("Failed to fetch report:", error);
    return null;
  }
}
