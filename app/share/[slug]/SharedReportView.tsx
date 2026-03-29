"use client";

import Link from "next/link";
import { DatingAuditReport } from "@/types";
import ReportCard from "@/components/ReportCard";

interface SharedReportViewProps {
  report: DatingAuditReport;
  slug: string;
}

export default function SharedReportView({
  report,
  slug,
}: SharedReportViewProps) {
  return (
    <main className="min-h-screen y2k-bg">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <span
              className="sticker inline-flex items-center mb-4"
              style={{ background: "#FFD6E8" }}
            >
              🚩 Should I Date This Man?
            </span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">
            Shared Dating Audit 📋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Someone wanted you to see this...
          </p>
        </div>

        <ReportCard
          report={report}
          shareSlug={slug}
          onReset={() => (window.location.href = "/")}
        />

        {/* CTA */}
        <div className="mt-8 y2k-card p-6 text-center">
          <p className="font-black text-lg text-gray-900 mb-2">
            Want to audit your situationship? 👀
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Paste their profile and get the full roast — free, instant, brutal.
          </p>
          <Link href="/">
            <button className="y2k-btn px-6 py-3 text-base">
              🚩 Audit My Man
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
