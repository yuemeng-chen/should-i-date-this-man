"use client";

import Link from "next/link";
import { DatingAuditReport } from "@/types";
import ReportCard from "@/components/ReportCard";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SharedReportViewProps {
  report: DatingAuditReport;
  slug: string;
}

export default function SharedReportView({
  report,
  slug,
}: SharedReportViewProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-2 bg-neon-red/10 border border-neon-red/30 rounded-full px-4 py-1.5 text-xs text-neon-red font-medium mb-4 hover:bg-neon-red/20 transition-colors">
              <Zap className="w-3 h-3" />
              Should I Date This Man?
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">
            Shared Dating Audit 📋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Someone wanted you to see this...
          </p>
        </div>

        <ReportCard
          report={report}
          shareSlug={slug}
          onReset={() => (window.location.href = "/")}
        />

        {/* CTA */}
        <div className="mt-8 text-center bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <p className="text-white font-bold text-lg mb-2">
            Want to audit your situationship? 👀
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Paste their profile and get the full roast — free, instant, brutal.
          </p>
          <Link href="/">
            <Button size="lg">
              <Zap className="w-4 h-4" />
              Audit My Man
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
