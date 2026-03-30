import { DatingAuditReport } from "@/types";

export const MOCK_REPORT: DatingAuditReport = {
  dateabilityScore: 38,
  verdict: "He's disrupting trading cards, not your loneliness.",
  redFlags: [
    {
      flag: "Lives with cofounder",
      severity: "critical",
      roast: "You're dating into a situationship with his business partner.",
    },
    {
      flag: "Hyper-niche startup energy",
      severity: "medium",
      roast: "Trading card convention ticketing is not a personality.",
    },
    {
      flag: "Startup founder bandwidth",
      severity: "medium",
      roast: "You'll always be his Series B priority.",
    },
    {
      flag: "Bushwick founder combo",
      severity: "mild",
      roast: "His apartment smells like cold brew and pivot anxiety.",
    },
  ],
  greenFlags: [
    {
      flag: "Actually building something",
      comment: "At least it's a real product, not a podcast.",
    },
    {
      flag: "Tall-ish if honest",
      comment: "Height is doing heavy lifting for this profile.",
    },
  ],
  linkedInTranslations: [
    {
      buzzword: "startup founder",
      translation: "No salary, infinite confidence, equity in delusion.",
    },
    {
      buzzword: "building a platform",
      translation: "Has an MVP and 14 users, 9 are friends.",
    },
  ],
  heightAudit: {
    claimed: "6'3\"",
    actual: "6'1\"",
    deflationAmount: "-2 inches",
    comment: "Still tall, but the math ain't mathing.",
  },
  fictionalLookalike: {
    character: "Barney Stinson",
    source: "How I Met Your Mother",
    reason: "Treats dating like a startup pitch deck with a 3-slide exit strategy.",
  },
  roastSummary:
    "He lives with his cofounder in Bushwick, so every date night ends with a standup meeting at 11pm. His startup is a ticketing platform for trading card conventions — so he's either a visionary or deeply unserious. You'll never be his top priority unless you can close a seed round. The height is real-adjacent though, so there's that.",
  funnyOneLiner:
    "He'll ghost you mid-date to take a call about Pokémon logistics.",
  archetypeLabel: "📱 Tech Bro Villain",
  shareableCaption:
    "🚩 He's disrupting Yu-Gi-Oh ticketing and expecting you to be impressed",
};
