"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import ReportCard from "@/components/ReportCard";
import LoadingState from "@/components/LoadingState";
import { DatingAuditReport, RoastRequest } from "@/types";

export default function Home() {
  const [report, setReport] = useState<DatingAuditReport | null>(null);
  const [shareSlug, setShareSlug] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (request: RoastRequest) => {
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Try again!");
        return;
      }

      setReport(data.report);
      setShareSlug(data.shareSlug);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setShareSlug(undefined);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen y2k-bg">
      <div className="max-w-lg mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-black leading-none mb-4 text-gray-900 uppercase tracking-tight" style={{ fontSize: "clamp(3.5rem, 14vw, 6rem)", lineHeight: 0.9 }}>
            Should I<br />
            Date This<br />
            <span style={{ color: "#FF1493", WebkitTextStroke: "2px #111", paintOrder: "stroke fill" }}>
              Man?
            </span>
          </h1>
          <p className="text-gray-400 text-sm">
            Paste anything. Get the truth.
          </p>
        </div>

        {/* Input */}
        {!isLoading && !report && (
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        )}

        {isLoading && <LoadingState />}

        {error && !isLoading && (
          <div className="y2k-card p-5" style={{ background: "#FFF0F5" }}>
            <p className="font-black mb-2" style={{ color: "#FF1493" }}>Need more tea ☕</p>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">{error}</p>
            <button onClick={handleReset} className="y2k-btn px-5 py-2 text-sm">
              Try again
            </button>
          </div>
        )}

        {report && !isLoading && (
          <div id="results" className="slide-up">
            <ReportCard report={report} shareSlug={shareSlug} onReset={handleReset} />
          </div>
        )}

      </div>
    </main>
  );
}
