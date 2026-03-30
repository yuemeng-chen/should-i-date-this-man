import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
