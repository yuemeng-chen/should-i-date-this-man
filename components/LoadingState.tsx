"use client";

import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "reading between the red flags... 🚩",
  "translating 'entrepreneur' to 'unemployed'... 💀",
  "applying the Height De-Inflation Algorithm™...",
  "counting his situationship victims... 💔",
  "checking if the dog is doing 90% of the work... 🐕",
  "detecting main character delusion levels... 🎭",
  "cross-referencing 'not like other guys' claims...",
  "scanning for hidden finance bro energy... 📈",
  "measuring 'work hard play hard' toxicity... 🍺",
  "consulting the burn book... 💋",
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scrapbook-card p-10 text-center space-y-6" style={{ transform: "rotate(-1deg)" }}>
      <div className="text-6xl scribble">📖</div>

      <div>
        <h3 className="burn-heading text-2xl text-gray-900 mb-1">
          writing in the burn book...
        </h3>
        <p className="handwritten text-lg text-gray-500">this is gonna be good</p>
      </div>

      <div
        className="scrapbook-card p-4 min-h-[56px] flex items-center justify-center"
        style={{ background: "var(--pink-light)", transform: "rotate(0.5deg)" }}
      >
        <p className="handwritten text-lg text-gray-800 text-center" key={messageIndex}>
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="text-lg animate-bounce"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            {["💋", "🚩", "💅", "✂️"][i]}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-400">should take under a minute ✨</p>
    </div>
  );
}
