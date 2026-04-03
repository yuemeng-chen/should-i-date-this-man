"use client";

import { useRef, useState, useEffect } from "react";
import { DatingAuditReport } from "@/types";
import { getSeverityEmoji } from "@/lib/utils";
import { Download, Copy, Check, RefreshCw, Share2 } from "lucide-react";

function CharacterImage({ name }: { name: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/ /g, "_"))}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.thumbnail?.source) {
          setSrc(data.thumbnail.source);
        }
      } catch {
        // silently fail — no image is fine
      }
    };
    fetchImage();
  }, [name]);

  if (!src) {
    return (
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: 120, height: 120, background: "var(--pink-light)", borderRadius: 8 }}
      >
        <span className="text-4xl">🎭</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      className="shrink-0 object-cover"
      style={{ width: 120, height: 120, borderRadius: 8, border: "3px solid white", boxShadow: "2px 3px 6px rgba(0,0,0,0.15)" }}
    />
  );
}

interface ReportCardProps {
  report: DatingAuditReport;
  shareSlug?: string;
  memeUrl?: string;
  onReset: () => void;
  originalRequest?: unknown;
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

const GIRL_ARCHETYPES = ["👑 Main Character", "💅 She's The Moment", "✨ Out of His League", "🦋 Too Good For This App", "💕 Wifey Material", "🔥 The One That Got Away"];

const GIRL_STAMPS: { stamp: string; subtitle: string }[] = [
  { stamp: "SHE'S THE MOMENT", subtitle: "no notes, just vibes" },
  { stamp: "QUEEN", subtitle: "she ate and left no crumbs" },
  { stamp: "CERTIFIED SLAY", subtitle: "he should be so lucky" },
  { stamp: "MAIN CHARACTER", subtitle: "and everyone else is an extra" },
  { stamp: "ICONIC", subtitle: "the blueprint tbh" },
];

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

function getScoreTier(score: number, archetype?: string) {
  const isGirlProfile = archetype && GIRL_ARCHETYPES.includes(archetype);

  if (isGirlProfile) {
    const seed = score * 31 + Math.floor(Date.now() / 60000);
    const pick = GIRL_STAMPS[seed % GIRL_STAMPS.length];
    return { color: "#D4488E", stamp: pick.stamp, subtitle: pick.subtitle };
  }

  const tier = SCORE_TIERS.find(t => score >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1];
  const seed = score * 31 + Math.floor(Date.now() / 60000);
  const pick = tier.options[seed % tier.options.length];
  return { color: tier.color, stamp: pick.stamp, subtitle: pick.subtitle };
}

function ScoreStamp({ score, archetype }: { score: number; archetype?: string }) {
  const { color, stamp: label } = getScoreTier(score, archetype);
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


const GIRL_REPORT = {
  archetypeLabel: "✨ Out of His League",
  dateabilityScore: 100,
  verdict: "She's the moment. He should be auditioning for her.",
  funnyOneLiner: "She's not out of your league, she's out of your time zone, your tax bracket, and your vibe.",
  shareableCaption: "👑 she doesn't need a man, a man needs her",
};

function isGirlProfile(report: DatingAuditReport): boolean {
  return GIRL_ARCHETYPES.includes(report.archetypeLabel);
}

export default function ReportCard({ report, shareSlug, memeUrl, onReset, originalRequest }: ReportCardProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = async () => {
    const url = shareSlug ? `${window.location.origin}/share/${shareSlug}` : window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inlineExternalImages = async (container: HTMLElement) => {
    const imgs = container.querySelectorAll("img");
    await Promise.all(
      Array.from(imgs).map(async (img) => {
        if (!img.src || img.src.startsWith("data:") || img.src.startsWith(window.location.origin)) return;
        try {
          // Route through our proxy to avoid CORS issues on mobile
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(img.src)}`;
          const res = await fetch(proxyUrl);
          const blob = await res.blob();
          const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          img.src = dataUrl;
        } catch {
          // silently skip — image just won't appear in screenshot
        }
      })
    );
  };

  const generateImage = async (): Promise<Blob | null> => {
    if (!reportRef.current) return null;

    await inlineExternalImages(reportRef.current);

    const banner = reportRef.current.querySelector("[data-png-banner]") as HTMLElement | null;
    if (banner) {
      banner.style.display = "block";
      banner.style.height = "auto";
      banner.style.overflow = "visible";
    }
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(reportRef.current, { quality: 1, pixelRatio: 2, backgroundColor: "#E8779A" });
    if (banner) {
      banner.style.display = "none";
    }

    const res = await fetch(dataUrl);
    return res.blob();
  };

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const blob = await generateImage();
      if (!blob) return;

      const file = new File([blob], `burn-book-${report.dateabilityScore}.png`, { type: "image/png" });

      // On mobile, use share sheet so users can save to camera roll
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        // Desktop fallback: regular download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = file.name;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = shareSlug ? `${window.location.origin}/share/${shareSlug}` : window.location.href;
    if (navigator.share) {
      try {
        // Try sharing with the image + link
        const blob = await generateImage();
        if (blob) {
          const file = new File([blob], `burn-book-${report.dateabilityScore}.png`, { type: "image/png" });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ title: "Should I Date This Man?", text: `${report.shareableCaption}\n${url}`, files: [file] });
            return;
          }
        }
      } catch {
        // Fall through to link-only share
      }
      await navigator.share({ title: "Should I Date This Man?", text: report.shareableCaption, url });
    } else {
      handleCopy();
    }
  };

  // Girl profile — show generic hardcoded response
  if (isGirlProfile(report)) {
    const g = GIRL_REPORT;
    return (
      <div className="space-y-4">
        <div ref={reportRef}>
          <div className="scrapbook-card overflow-hidden">
            {/* Header */}
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
                {g.archetypeLabel}
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Score — always 100 */}
              <div className="text-center space-y-3 py-4">
                <div className="mb-20">
                  <ScoreStamp score={100} archetype={g.archetypeLabel} />
                </div>
                <p className="burn-heading text-lg text-gray-900">{getScoreTier(100, g.archetypeLabel).subtitle}</p>
                <p className="handwritten text-xl text-gray-600">{g.verdict}</p>
              </div>

              {/* One liner */}
              <div
                className="p-4 text-center relative"
                style={{
                  background: "var(--ink)",
                  transform: "rotate(0.8deg)",
                  boxShadow: "3px 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                <p className="text-white text-base leading-snug" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700 }}>
                  &ldquo;{g.funnyOneLiner}&rdquo;
                </p>
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
                  📲 send to the girls!
                </p>
                <p className="text-white font-black text-sm">{g.shareableCaption}</p>
              </div>

              <p className="text-center handwritten text-base text-gray-400 pt-2">
                shouldidatethisman.com • built by girls, for girls 💅
              </p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-10 w-full">
          <button onClick={handleDownload} disabled={downloading} className="sticker cursor-pointer hover:bg-gray-50 justify-center py-3 text-sm">
            <Download className="w-4 h-4" />
            {downloading ? "Saving..." : "Save"}
          </button>
          <button onClick={handleCopy} className="sticker cursor-pointer hover:bg-gray-50 justify-center py-3 text-sm">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button onClick={handleShare} className="sticker cursor-pointer hover:bg-gray-50 justify-center py-3 text-sm">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button onClick={onReset} className="sticker cursor-pointer hover:bg-gray-50 justify-center py-3 text-sm">
            <RefreshCw className="w-4 h-4" />
            Roast another
          </button>
        </div>
      </div>
    );
  }

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
              <ScoreStamp score={report.dateabilityScore} archetype={report.archetypeLabel} />
            </div>
            <p className="burn-heading text-lg text-gray-900">{getScoreTier(report.dateabilityScore, report.archetypeLabel).subtitle}</p>
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

          {/* Fictional lookalike */}
          {/* Lookalike + Meme side by side */}
          {(report.fictionalLookalike || memeUrl) && (
            <div className={`grid grid-cols-1 ${memeUrl && report.fictionalLookalike ? 'sm:grid-cols-2' : ''} gap-4 items-stretch`}>
              {/* Fictional Lookalike */}
              {report.fictionalLookalike && (
                <div
                  className="p-5 flex flex-col"
                  style={{
                    background: "var(--paper)",
                    border: "3px solid white",
                    transform: "rotate(-0.6deg)",
                    boxShadow: "2px 3px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  <p className="burn-heading text-lg text-gray-900 mb-3">🎭 Fictional Lookalike</p>
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                    <CharacterImage name={report.fictionalLookalike.actor || report.fictionalLookalike.character} />
                    <div>
                      <p className="font-black text-gray-900 text-xl">
                        {report.fictionalLookalike.character}
                      </p>
                      <p className="text-sm text-gray-500">{report.fictionalLookalike.source}</p>
                      <p className="handwritten text-base mt-2" style={{ color: "var(--pink-burn)" }}>
                        {report.fictionalLookalike.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Meme */}
              {memeUrl && (
                <div
                  className="p-5 flex flex-col"
                  style={{
                    background: "var(--paper)",
                    border: "3px solid white",
                    transform: "rotate(0.6deg)",
                    boxShadow: "2px 3px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  <p className="burn-heading text-lg text-gray-900 mb-3">🔮 Memelord Says</p>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div
                      className="w-full"
                      style={{
                        background: "white",
                        border: "3px solid white",
                        boxShadow: "1px 2px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={memeUrl}
                        alt="AI generated meme"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-300 mt-2 text-center italic">ai meme via memelord ✨</p>
                </div>
              )}
            </div>
          )}

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
              📲 send to the girls!
            </p>
            <p className="text-white font-black text-sm">{report.shareableCaption}</p>
          </div>

          <p className="text-center handwritten text-base text-gray-400 pt-2">
            shouldidatethisman.com • built by girls, for girls 💅
          </p>
        </div>
        </div>{/* close scrapbook-card */}
      </div>{/* close ref wrapper */}

      {/* Action bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-10 w-full">
        <button onClick={handleDownload} disabled={downloading} className="sticker cursor-pointer hover:bg-gray-50 justify-center py-3 text-sm">
          <Download className="w-4 h-4" />
          {downloading ? "Saving..." : "Save"}
        </button>
        <button onClick={handleCopy} className="sticker cursor-pointer hover:bg-gray-50 justify-center py-3 text-sm">
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button onClick={handleShare} className="sticker cursor-pointer hover:bg-gray-50 justify-center py-3 text-sm">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button onClick={onReset} className="sticker cursor-pointer hover:bg-gray-50 justify-center py-3 text-sm">
          <RefreshCw className="w-4 h-4" />
          Roast another
        </button>
      </div>
    </div>
  );
}
