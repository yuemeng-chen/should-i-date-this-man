"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import ReportCard from "@/components/ReportCard";
import LoadingState from "@/components/LoadingState";
import { DatingAuditReport, RoastRequest } from "@/types";
import Doodles from "@/components/Doodles";
import ErrorBoundary from "@/components/ErrorBoundary";
import { MOCK_REPORT } from "@/lib/mock-report";

/* Ransom-note title: each letter gets a random style + rotation */
function RansomTitle() {
  const words = [
    { text: "Should", break: false },
    { text: "I", break: false },
    { text: "Date", break: true },
    { text: "This", break: false },
    { text: "Man?", break: false },
  ];

  const styles = ["ransom-dark", "ransom-light", "ransom-pink", "ransom-paper"];
  const rotations = [-4, -2, 1, 3, -1, 2, -3, 0, 4, -2, 1, -1, 3, -3, 2, 0, -4, 1, -2, 3];

  let letterIndex = 0;

  return (
    <h1 className="text-center leading-relaxed mb-2" style={{ fontSize: "clamp(3rem, 10vw, 5.5rem)", lineHeight: 1.2 }}>
      {words.map((word, wi) => (
        <span key={wi}>
          {word.break && <br />}
          <span className="inline-block mx-1 whitespace-nowrap">
            {word.text.split("").map((letter, li) => {
              const style = styles[(letterIndex) % styles.length];
              const rot = rotations[letterIndex % rotations.length];
              letterIndex++;
              return (
                <span
                  key={li}
                  className={`ransom-letter ${style}`}
                  style={{ transform: `rotate(${rot}deg)`, display: "inline-block" }}
                >
                  {letter}
                </span>
              );
            })}
          </span>
          {" "}
        </span>
      ))}
    </h1>
  );
}

export default function Home() {
  const [report, setReport] = useState<DatingAuditReport | null>(null);
  const [shareSlug, setShareSlug] = useState<string | undefined>();
  const [memeUrl, setMemeUrl] = useState<string | undefined>();
  const [lastRequest, setLastRequest] = useState<RoastRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (request: RoastRequest) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    setLastRequest(request);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        // Vercel returned non-JSON (HTML error page, payload too large, etc.)
        const hasImages = request.imageBase64s && request.imageBase64s.length > 0;
        setError(
          hasImages
            ? "Upload too large — try fewer screenshots (3-4 is the sweet spot) 📸"
            : "Something went wrong. Try again!"
        );
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Try again!");
        return;
      }

      setReport(data.report);
      setShareSlug(data.shareSlug);
      setMemeUrl(data.memeUrl);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestMode = () => {
    setLastRequest({ profileType: "general", profileText: "[TEST MODE]" });
    setReport(MOCK_REPORT);
    setShareSlug(undefined);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleReset = () => {
    setReport(null);
    setShareSlug(undefined);
    setMemeUrl(undefined);
    setLastRequest(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className={`burn-book-bg flex flex-col ${!report && !isLoading && !error ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Doodles />
      <div className={`max-w-4xl mx-auto px-6 flex-1 flex flex-col w-full ${!report && !isLoading && !error ? 'justify-center' : 'pt-[8vh]'}`}>

        {/* Header */}
        <div className="text-center mb-8">
          <RansomTitle />
          <p className="handwritten text-2xl text-white" style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.3)" }}>
            let it out, honey. write in the book. 💋
          </p>
        </div>

        {isLoading && <LoadingState />}

        {error && !isLoading && (
          <div className="scrapbook-card p-5 tilt-left">
            <p className="burn-heading text-xl mb-2" style={{ color: "var(--pink-hot)" }}>need more tea ☕</p>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">{error}</p>
            <button onClick={handleReset} className="burn-btn px-5 py-2 text-sm">
              Try again
            </button>
          </div>
        )}

        {report && !isLoading && (
          <div id="results" className="slide-up">
            <ErrorBoundary onReset={handleReset}>
              <ReportCard report={report} shareSlug={shareSlug} memeUrl={memeUrl} onReset={handleReset} originalRequest={lastRequest ?? undefined} />
            </ErrorBoundary>
          </div>
        )}


        {/* Input */}
        {!isLoading && !report && (
          <div className="slide-up pb-8">
            <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={handleTestMode}
                className="mt-3 w-full text-xs text-gray-400 hover:text-gray-600 py-2 opacity-50 hover:opacity-100 transition-opacity"
              >
                🧪 test mode — skip API
              </button>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="text-center py-6 mt-auto">
        <p className="text-xs text-white/40">By Nicole Chen and Naomi Wang | SillyHacks NYC 2026</p>
      </footer>
    </main>
  );
}
