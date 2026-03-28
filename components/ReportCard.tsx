"use client";

import { useRef, useState } from "react";
import { DatingAuditReport } from "@/types";
import { getSeverityEmoji } from "@/lib/utils";
import { Download, Copy, Check, RefreshCw, Share2 } from "lucide-react";

interface ReportCardProps {
  report: DatingAuditReport;
  shareSlug?: string;
  onReset: () => void;
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 70 ? "#00C853" : score >= 45 ? "#FFD700" : "#FF1493";
  const label = score >= 70 ? "Slay ✅" : score >= 45 ? "Maybe 🤔" : "Run. 🚩";
  return (
    <div
      className="flex flex-col items-center justify-center rounded-full w-28 h-28 mx-auto"
      style={{ background: color, border: "4px solid #111", boxShadow: "4px 4px 0 #111" }}
    >
      <span className="text-4xl font-black text-white" style={{ WebkitTextStroke: "1px #111" }}>
        {score}
      </span>
      <span className="text-xs font-bold text-white">{label}</span>
    </div>
  );
}

export default function ReportCard({ report, shareSlug, onReset }: ReportCardProps) {
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
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(reportRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#FFF0F5" });
      const link = document.createElement("a");
      link.download = `dating-audit-${report.dateabilityScore}.png`;
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
    <div className="space-y-3">
      {/* Action bar */}
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={handleDownload} disabled={downloading} className="sticker bg-white cursor-pointer hover:bg-gray-50">
          <Download className="w-3 h-3" />
          {downloading ? "Saving..." : "Save"}
        </button>
        <button onClick={handleCopy} className="sticker bg-white cursor-pointer hover:bg-gray-50">
          {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button onClick={handleShare} className="sticker bg-white cursor-pointer hover:bg-gray-50">
          <Share2 className="w-3 h-3" />
          Share
        </button>
        <button onClick={onReset} className="sticker bg-white cursor-pointer hover:bg-gray-50 ml-auto">
          <RefreshCw className="w-3 h-3" />
          New audit
        </button>
      </div>

      {/* Report */}
      <div ref={reportRef} className="y2k-card overflow-hidden">

        {/* Header */}
        <div className="p-5 text-center" style={{ background: "#FFD6E8", borderBottom: "3px solid #111" }}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Dating Audit™</p>
          <div className="inline-block sticker mb-2" style={{ background: "#FF1493", color: "white", border: "2px solid #111" }}>
            {report.archetypeLabel}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Score + verdict */}
          <div className="text-center space-y-3">
            <ScoreCircle score={report.dateabilityScore} />
            <p className="font-black text-lg text-gray-900">{report.scoreLabel}</p>
            <p className="text-sm font-medium text-gray-700 leading-snug">{report.verdict}</p>
          </div>

          {/* One liner — the star of the show */}
          <div className="rounded-2xl p-4 text-center" style={{ background: "#111" }}>
            <p className="text-white font-bold text-base leading-snug">&ldquo;{report.funnyOneLiner}&rdquo;</p>
          </div>

          {/* Flags — side by side */}
          <div className="grid grid-cols-1 gap-3">
            {/* Red flags */}
            <div>
              <p className="font-black text-sm text-gray-900 mb-2">🚩 Red Flags</p>
              <div className="space-y-2">
                {report.redFlags.map((flag, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-3 flex gap-2 items-start"
                    style={{
                      background: flag.severity === "critical" ? "#FFE0E8" : flag.severity === "medium" ? "#FFF3E0" : "#FFFDE7",
                      border: "2px solid #111",
                    }}
                  >
                    <span className="text-xs mt-0.5 shrink-0">{getSeverityEmoji(flag.severity)}</span>
                    <div>
                      <p className="font-bold text-sm text-gray-900 leading-tight">{flag.flag}</p>
                      <p className="text-xs text-gray-600 mt-0.5 italic">{flag.roast}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Green flags */}
            {report.greenFlags.length > 0 && (
              <div>
                <p className="font-black text-sm text-gray-900 mb-2">✅ Green Flags</p>
                <div className="space-y-2">
                  {report.greenFlags.map((flag, i) => (
                    <div key={i} className="rounded-xl p-3 flex gap-2 items-start" style={{ background: "#E8FFE8", border: "2px solid #111" }}>
                      <span className="text-xs mt-0.5 shrink-0">✅</span>
                      <div>
                        <p className="font-bold text-sm text-gray-900 leading-tight">{flag.flag}</p>
                        <p className="text-xs text-gray-600 mt-0.5 italic">{flag.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LinkedIn translator — only if present */}
          {report.linkedInTranslations && report.linkedInTranslations.length > 0 && (
            <div>
              <p className="font-black text-sm text-gray-900 mb-2">🤵 LinkedIn Decoded</p>
              <div className="space-y-2">
                {report.linkedInTranslations.map((t, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "#EEE8FF", border: "2px solid #111" }}>
                    <p className="text-xs text-gray-500">He says: <span className="font-bold text-gray-900">&ldquo;{t.buzzword}&rdquo;</span></p>
                    <p className="text-xs text-purple-700 font-semibold mt-0.5">→ {t.translation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Height audit — only if present */}
          {report.heightAudit && (
            <div className="rounded-xl p-4" style={{ background: "#FFF8E1", border: "2px solid #111" }}>
              <p className="font-black text-sm text-gray-900 mb-2">📏 Height Audit™</p>
              <div className="flex gap-5 items-center mb-1">
                <div>
                  <p className="text-xs text-gray-500">Claims</p>
                  <p className="font-black text-gray-900">{report.heightAudit.claimed}</p>
                </div>
                <span className="text-lg">→</span>
                <div>
                  <p className="text-xs text-gray-500">Actually</p>
                  <p className="font-black" style={{ color: "#FF6600" }}>{report.heightAudit.actual}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Off by</p>
                  <p className="font-black" style={{ color: "#FF1493" }}>{report.heightAudit.deflationAmount}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">{report.heightAudit.comment}</p>
            </div>
          )}

          {/* Roast summary */}
          <div className="rounded-2xl p-4" style={{ background: "#FFD6E8", border: "2px solid #111" }}>
            <p className="text-sm text-gray-800 leading-relaxed font-medium">{report.roastSummary}</p>
          </div>

          {/* Share caption */}
          <div className="rounded-2xl p-4 text-center" style={{ background: "#9314FF", border: "3px solid #111" }}>
            <p className="text-xs font-bold text-purple-200 uppercase tracking-widest mb-1">📲 Send to the group chat</p>
            <p className="text-white font-black text-sm">{report.shareableCaption}</p>
          </div>

          <p className="text-center text-xs text-gray-400">shouldidatethisman.com • for entertainment only 💅</p>
        </div>
      </div>
    </div>
  );
}
