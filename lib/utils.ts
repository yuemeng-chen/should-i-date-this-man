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
