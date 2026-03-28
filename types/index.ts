export type ProfileType = "linkedin" | "dating" | "resume" | "general";

export interface RoastRequest {
  profileType: ProfileType;
  profileUrl?: string;
  profileText?: string;
  imageBase64?: string;
  claimedHeight?: string;
}

export interface RedFlag {
  flag: string;
  severity: "mild" | "medium" | "critical";
  roast: string;
}

export interface GreenFlag {
  flag: string;
  comment: string;
}

export interface LinkedInTranslation {
  buzzword: string;
  translation: string;
}

export interface DatingAuditReport {
  dateabilityScore: number;
  scoreLabel: string;
  verdict: string;
  redFlags: RedFlag[];
  greenFlags: GreenFlag[];
  linkedInTranslations?: LinkedInTranslation[];
  heightAudit?: {
    claimed: string;
    actual: string;
    deflationAmount: string;
    comment: string;
  };
  roastSummary: string;
  funnyOneLiner: string;
  archetypeLabel: string;
  shareableCaption: string;
}

export interface RoastResponse {
  report: DatingAuditReport;
  raw: string;
}
