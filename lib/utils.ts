import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "text-neon-green";
  if (score >= 50) return "text-yellow-400";
  if (score >= 25) return "text-orange-400";
  return "text-neon-red";
}

export function getScoreGlowClass(score: number): string {
  if (score >= 75) return "shadow-neon-green";
  if (score >= 50) return "shadow-[0_0_10px_#facc15]";
  if (score >= 25) return "shadow-[0_0_10px_#fb923c]";
  return "shadow-neon-red";
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "text-neon-red border-neon-red/50 bg-red-950/50";
    case "medium":
      return "text-orange-400 border-orange-400/50 bg-orange-950/50";
    case "mild":
      return "text-yellow-400 border-yellow-400/50 bg-yellow-950/50";
    default:
      return "text-gray-400 border-gray-400/50 bg-gray-900/50";
  }
}

export function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case "critical":
      return "🚩🚩🚩";
    case "medium":
      return "🚩🚩";
    case "mild":
      return "🚩";
    default:
      return "🚩";
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Return the full data URL so the server can detect the correct media type
      resolve(reader.result as string);
    };
    reader.onerror = reject;
  });
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Holy Green Flags Batman";
  if (score >= 65) return "Surprisingly Dateable";
  if (score >= 45) return "Conditional Yes";
  if (score >= 25) return "Proceed with Caution";
  return "Hard Pass, Bestie";
}
