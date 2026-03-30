import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Should I Date This Man? 🚩 AI Dating Audit",
  description:
    "The AI-powered dating profile roast tool. Paste his LinkedIn, dating app bio, or upload a screenshot — get a brutally honest audit with red flags, green flags, and a dateability score.",
  keywords: [
    "dating",
    "roast",
    "ai",
    "dating profile audit",
    "red flags",
    "dating coach",
    "linkedin roast",
  ],
  openGraph: {
    title: "Should I Date This Man? 🚩 AI Dating Audit",
    description:
      "Get a brutally honest AI audit of any man's dating profile, LinkedIn, or resume. Red flags, green flags, and a full roast included.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💋</text></svg>" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
