"use client";

import { useRef, useState } from "react";
import { DatingAuditReport, RoastRequest } from "@/types";
import { getSeverityEmoji } from "@/lib/utils";
import { Download, Copy, Check, RefreshCw, Share2 } from "lucide-react";

interface ReportCardProps {
  report: DatingAuditReport;
  shareSlug?: string;
  onReset: () => void;
  originalRequest?: RoastRequest;
}

function PngRansomTitle() {
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
    <h2
      className="relative z-10 text-center leading-relaxed"
      style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", lineHeight: 1.2 }}
    >
      {words.map((word, wi) => (
        <span key={wi}>
          {word.break && <br />}
          <span className="inline-block mx-1 whitespace-nowrap">
            {word.text.split("").map((letter, li) => {
              const style = styles[letterIndex % styles.length];
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
      ))}{" "}
    </h2>
  );
}

const SCORE_TIERS: { min: number; color: string; options: { stamp: string; subtitle: string }[] }[] = [
  { min: 90, color: "#1B5E20", options: [
    { stamp: "LOCK HIM DOWN", subtitle: "wife him up immediately, no cap" },
    { stamp: "KEEPER", subtitle: "he's the blueprint honestly" },
    { stamp: "WIFEY HIM", subtitle: "secure the bag before someone else does" },
    { stamp: "MAIN CHARACTER", subtitle: "and for once that's a good thing" },
    { stamp: "NO NOTES", subtitle: "we have nothing bad to say and we hate it" },
  ]},
  { min: 80, color: "#2E7D32", options: [
    { stamp: "SLAY", subtitle: "ok he kinda ate ngl" },
    { stamp: "HE ATE", subtitle: "left no crumbs either" },
    { stamp: "GREEN FLAG", subtitle: "rare sighting, don't scare him away" },
    { stamp: "PASSED THE VIBE CHECK", subtitle: "against all odds somehow" },
    { stamp: "NOT DELUSIONAL", subtitle: "which is basically a superpower rn" },
  ]},
  { min: 65, color: "#558B2F", options: [
    { stamp: "HE'S AIGHT", subtitle: "not the worst? the bar is underground tho" },
    { stamp: "COULD BE WORSE", subtitle: "damning with faint praise but here we are" },
    { stamp: "DECENT-ISH", subtitle: "your mom would tolerate him" },
    { stamp: "LOW-KEY OK", subtitle: "he's a 6 who thinks he's a 9" },
    { stamp: "ALMOST", subtitle: "so close yet so far bestie" },
  ]},
  { min: 50, color: "#E65100", options: [
    { stamp: "MID", subtitle: "he's giving NPC energy" },
    { stamp: "MEH", subtitle: "the human equivalent of room temperature water" },
    { stamp: "BEIGE FLAG", subtitle: "not toxic just deeply boring" },
    { stamp: "FORGETTABLE", subtitle: "you'll ghost him and forget you did" },
    { stamp: "FILLER ARC", subtitle: "he's the episode you skip on rewatch" },
  ]},
  { min: 35, color: "#8B008B", options: [
    { stamp: "ICK", subtitle: "the ick is strong with this one" },
    { stamp: "CRINGE", subtitle: "physically recoiling through the screen" },
    { stamp: "UNSERIOUS", subtitle: "he's out here playing games at big age" },
    { stamp: "DELULU", subtitle: "the delusion is not the solusion babe" },
    { stamp: "CAUGHT IN 4K", subtitle: "every photo is a new red flag" },
  ]},
  { min: 20, color: "#C40060", options: [
    { stamp: "TOXIC", subtitle: "this man is a whole red flag factory" },
    { stamp: "WALKING ICK", subtitle: "every swipe was a mistake" },
    { stamp: "LANDFILL", subtitle: "the trash took itself out and came back" },
    { stamp: "UNHINGED", subtitle: "bestie what were you thinking" },
    { stamp: "SITUATIONSHIP STARTER KIT", subtitle: "he will waste your time professionally" },
  ]},
  { min: 0, color: "#8B0000", options: [
    { stamp: "RUN", subtitle: "block, delete, witness protection" },
    { stamp: "BLOCKED", subtitle: "do not pass go, do not collect his number" },
    { stamp: "RESTRAINING ORDER", subtitle: "the courts would understand" },
    { stamp: "DANGER", subtitle: "this man is a public safety hazard" },
    { stamp: "ABORT MISSION", subtitle: "evacuate immediately this is not a drill" },
  ]},
];

function getScoreTier(score: number) {
  const tier = SCORE_TIERS.find(t => score >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1];
  // Use score + current minute as seed so it's stable during a session but varies between reports
  const seed = score * 31 + Math.floor(Date.now() / 60000);
  const pick = tier.options[seed % tier.options.length];
  return { color: tier.color, stamp: pick.stamp, subtitle: pick.subtitle };
}

function ScoreStamp({ score }: { score: number }) {
  const { color, stamp: label } = getScoreTier(score);
  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className="stamp"
        style={{ color, borderColor: color, fontSize: "clamp(2.5rem, 10vw, 4.5rem)", opacity: 0.8 }}
      >
        {label}
      </div>
      <span className="absolute text-7xl font-black" style={{ color, fontFamily: "'Playfair Display', serif", top: "80%" }}>
        {score}<span className="text-3xl">/100</span>
      </span>
    </div>
  );
}

function InputSummary({ request }: { request: RoastRequest }) {
  const hasText = !!request.profileText;
  const imageCount = request.imageBase64s?.length ?? (request.imageBase64 ? 1 : 0);
  const textPreview = request.profileText
    ? request.profileText.length > 150
      ? request.profileText.slice(0, 150) + "..."
      : request.profileText
    : null;

  return (
    <div
      className="scrapbook-card p-4 mb-4"
      style={{ background: "var(--paper-dark)", transform: "rotate(0.3deg)" }}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">the evidence</p>
      {textPreview && (
        <p className="handwritten text-lg text-gray-700 leading-snug">
          &ldquo;{textPreview}&rdquo;
        </p>
      )}
      {imageCount > 0 && (
        <p className="handwritten text-base text-gray-500 mt-1">
          📸 + {imageCount} screenshot{imageCount > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

export default function ReportCard({ report, shareSlug, onReset, originalRequest }: ReportCardProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = async () => {
    const url = shareSlug ? `${window.location.origin}/share/${shareSlug}` : window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      // Reveal the hidden banner for the screenshot
      const banner = reportRef.current.querySelector("[data-png-banner]") as HTMLElement | null;
      if (banner) {
        banner.style.display = "block";
        banner.style.height = "auto";
        banner.style.overflow = "visible";
      }
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(reportRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#E8779A" });
      // Re-hide the banner
      if (banner) {
        banner.style.display = "none";
      }
      const link = document.createElement("a");
      link.download = `burn-book-${report.dateabilityScore}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = shareSlug ? `${window.location.origin}/share/${shareSlug}` : window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "Should I Date This Man?", text: report.shareableCaption, url });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-4">
      {/* Downloadable area — title + report */}
      <div ref={reportRef}>
        {/* Title banner — hidden on page, revealed for PNG export */}
        <div
          data-png-banner
          className="p-8 text-center relative overflow-hidden"
          style={{ display: "none", background: "var(--pink-bg)" }}
        >
          {/* Lipstain background marks */}
          {[
            { top: "-10%", left: "-5%", rot: -20, opacity: 0.3 },
            { top: "5%", left: "70%", rot: 35, opacity: 0.25 },
            { top: "-15%", left: "35%", rot: 50, opacity: 0.2 },
            { top: "10%", left: "90%", rot: -40, opacity: 0.28 },
            { top: "-5%", left: "10%", rot: 60, opacity: 0.22 },
            { top: "15%", left: "55%", rot: -15, opacity: 0.25 },
          ].map((k, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: k.top,
                left: k.left,
                width: 180,
                height: 180,
                opacity: k.opacity,
                transform: `rotate(${k.rot}deg)`,
                filter: `hue-rotate(${[0, 330, 345, 320, 350, 310][i]}deg) saturate(0.8)`,
                pointerEvents: "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lipstain.png" alt="" className="w-full h-full object-contain" />
            </div>
          ))}
          <PngRansomTitle />
        </div>

        {/* Report — the burn book page */}
        <div className="scrapbook-card overflow-hidden">

        {/* Header — taped on label */}
        <div className="p-6 md:p-8 text-center relative" style={{ background: "var(--pink-light)", borderBottom: "2px solid rgba(0,0,0,0.1)" }}>
          <p className="handwritten text-lg text-gray-500 mb-1">the burn book says...</p>
          <div
            className="inline-block px-4 py-1 mb-2"
            style={{
              background: "var(--ink)",
              color: "white",
              transform: "rotate(-2deg)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: "1px",
            }}
          >
            {report.archetypeLabel}
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Score */}
          <div className="text-center space-y-3 py-4">
            <div className="mb-20">
              <ScoreStamp score={report.dateabilityScore} />
            </div>
            <p className="burn-heading text-lg text-gray-900">{getScoreTier(report.dateabilityScore).subtitle}</p>
            <p className="handwritten text-xl text-gray-600">{report.verdict}</p>
          </div>

          {/* One liner — the star quote */}
          <div
            className="p-4 text-center relative"
            style={{
              background: "var(--ink)",
              transform: "rotate(0.8deg)",
              boxShadow: "3px 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <p className="text-white text-base leading-snug" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700 }}>
              &ldquo;{report.funnyOneLiner}&rdquo;
            </p>
          </div>

          {/* Red flags */}
          <div>
            <p className="burn-heading text-lg text-gray-900 mb-3">🚩 Red Flags</p>
            <div className="space-y-2">
              {[...report.redFlags].sort((a, b) => {
                const order = { critical: 0, medium: 1, mild: 2 };
                return order[a.severity] - order[b.severity];
              }).map((flag, i) => (
                <div
                  key={i}
                  className={`p-3 flag-${flag.severity}`}
                  style={{
                    transform: `rotate(${[-0.5, 0.3, -0.8, 0.6][i % 4]}deg)`,
                    boxShadow: "1px 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="flex gap-2 items-start">
                    <span className="text-sm shrink-0">{getSeverityEmoji(flag.severity)}</span>
                    <div>
                      <p className={`font-bold text-sm ${flag.severity === "critical" ? "text-white" : "text-gray-900"}`}>
                        {flag.flag}
                      </p>
                      <p className={`handwritten text-base mt-0.5 ${flag.severity === "critical" ? "text-pink-100" : "text-gray-500"}`}>
                        {flag.roast}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Green flags */}
          {report.greenFlags.length > 0 && (
            <div>
              <p className="burn-heading text-lg text-gray-900 mb-3">ok we&apos;ll give him that...</p>
              <div className="space-y-2">
                {report.greenFlags.map((flag, i) => (
                  <div
                    key={i}
                    className="p-3"
                    style={{
                      background: "var(--paper)",
                      borderLeft: "5px solid #4CAF50",
                      transform: `rotate(${[0.5, -0.3][i % 2]}deg)`,
                      boxShadow: "1px 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div className="flex gap-2 items-start">
                      <span className="text-sm shrink-0">✅</span>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{flag.flag}</p>
                        <p className="handwritten text-base text-gray-500 mt-0.5">{flag.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LinkedIn translator */}
          {report.linkedInTranslations && report.linkedInTranslations.length > 0 && (
            <div>
              <p className="burn-heading text-lg text-gray-900 mb-3">🔍 What He Says vs What He Means</p>
              <div className="space-y-2">
                {report.linkedInTranslations.map((t, i) => (
                  <div
                    key={i}
                    className="p-3"
                    style={{
                      background: "var(--paper)",
                      borderLeft: "5px solid var(--pink-page)",
                      transform: `rotate(${[-0.6, 0.4, -0.3][i % 3]}deg)`,
                      boxShadow: "1px 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <p className="text-xs text-gray-500">
                      he says: <span className="font-bold text-gray-900">&ldquo;{t.buzzword}&rdquo;</span>
                    </p>
                    <p className="handwritten text-lg mt-0.5" style={{ color: "var(--pink-burn)" }}>
                      → {t.translation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Height audit */}
          {report.heightAudit && (
            <div
              className="p-4"
              style={{
                background: "var(--paper-dark)",
                borderLeft: "5px solid var(--pink-hot)",
                transform: "rotate(0.5deg)",
                boxShadow: "1px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <p className="burn-heading text-lg text-gray-900 mb-2">📏 Height Audit™</p>
              <div className="flex gap-5 items-center mb-2">
                <div>
                  <p className="text-xs text-gray-500">Claims</p>
                  <p className="font-black text-gray-900 text-lg">{report.heightAudit.claimed}</p>
                </div>
                <span className="handwritten text-2xl">→</span>
                <div>
                  <p className="text-xs text-gray-500">Actually</p>
                  <p className="font-black text-lg" style={{ color: "var(--pink-burn)" }}>{report.heightAudit.actual}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Off by</p>
                  <p className="font-black text-lg" style={{ color: "var(--pink-hot)" }}>{report.heightAudit.deflationAmount}</p>
                </div>
              </div>
              <p className="handwritten text-base text-gray-500">{report.heightAudit.comment}</p>
            </div>
          )}

          {/* Roast summary */}
          <div
            className="p-4"
            style={{
              background: "var(--pink-light)",
              transform: "rotate(-0.5deg)",
              boxShadow: "2px 3px 6px rgba(0,0,0,0.1)",
            }}
          >
            <p className="handwritten text-lg text-gray-800 leading-relaxed">{report.roastSummary}</p>
          </div>

          {/* Share caption */}
          <div
            className="p-4 text-center"
            style={{
              background: "var(--ink)",
              transform: "rotate(1deg)",
              boxShadow: "3px 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--pink-page)" }}>
              📲 send to the group chat
            </p>
            <p className="text-white font-black text-sm">{report.shareableCaption}</p>
          </div>

          <p className="text-center handwritten text-base text-gray-400 pt-2">
            shouldidatethisman.com • for entertainment only 💅
          </p>
        </div>
        </div>{/* close scrapbook-card */}
      </div>{/* close ref wrapper */}

      {/* Action bar */}
      <div className="flex gap-2 flex-wrap items-center justify-center pb-10">
        <button onClick={handleDownload} disabled={downloading} className="sticker cursor-pointer hover:bg-gray-50">
          <Download className="w-3 h-3" />
          {downloading ? "Saving..." : "Save"}
        </button>
        <button onClick={handleCopy} className="sticker cursor-pointer hover:bg-gray-50">
          {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button onClick={handleShare} className="sticker cursor-pointer hover:bg-gray-50">
          <Share2 className="w-3 h-3" />
          Share
        </button>
        <button onClick={onReset} className="sticker cursor-pointer hover:bg-gray-50">
          <RefreshCw className="w-3 h-3" />
          Roast another
        </button>
      </div>
    </div>
  );
}
