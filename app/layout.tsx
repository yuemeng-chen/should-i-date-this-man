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
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
