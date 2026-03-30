"use client";

import Link from "next/link";
import { DatingAuditReport } from "@/types";
import ReportCard from "@/components/ReportCard";
import Doodles from "@/components/Doodles";

interface SharedReportViewProps {
  report: DatingAuditReport;
  slug: string;
}

export default function SharedReportView({
  report,
  slug,
}: SharedReportViewProps) {
  return (
    <main className="min-h-screen burn-book-bg">
      <Doodles />
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <span
              className="sticker inline-flex items-center mb-4 cursor-pointer hover:bg-gray-50"
              style={{ background: "var(--pink-light)" }}
            >
              🚩 Should I Date This Man?
            </span>
          </Link>
          <h1 className="burn-heading text-3xl text-white" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
            someone sent you a page from the burn book 📖
          </h1>
        </div>

        <ReportCard
          report={report}
          shareSlug={slug}
          onReset={() => (window.location.href = "/")}
        />

        {/* CTA */}
        <div className="mt-8 scrapbook-card p-6 text-center" style={{ transform: "rotate(0.5deg)" }}>
          <p className="burn-heading text-xl text-gray-900 mb-2">
            want to add someone to the burn book? 👀
          </p>
          <p className="handwritten text-lg text-gray-500 mb-4">
            paste their profile and get the full roast
          </p>
          <Link href="/">
            <button className="burn-btn px-6 py-3 text-base">
              🚩 ROAST HIM
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
