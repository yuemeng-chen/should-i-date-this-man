"use client";

import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Reading between the red flags... 🚩",
  "Translating 'entrepreneur' to 'unemployed'... 💀",
  "Applying the Height De-Inflation Algorithm™...",
  "Counting his situationship victims... 💔",
  "Checking if the dog is doing 90% of the work... 🐕",
  "Detecting main character delusion levels... 🎭",
  "Cross-referencing 'not like other guys' claims...",
  "Scanning for hidden finance bro energy... 📈",
  "Measuring 'work hard play hard' toxicity... 🍺",
  "Consulting the AI dating oracle... 🔮",
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
    <div className="y2k-card p-10 text-center space-y-6 mt-4">
      <div className="text-6xl animate-bounce">🔍</div>

      <div>
        <h3 className="text-2xl font-black text-gray-900 mb-1">
          Running the audit...
        </h3>
        <p className="text-sm text-gray-500">Our AI bestie is on the case</p>
      </div>

      <div className="y2k-card-pink p-4 min-h-[56px] flex items-center justify-center">
        <p className="text-sm font-bold text-gray-800 text-center" key={messageIndex}>
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full animate-bounce"
            style={{
              background: ["#FF1493", "#9314FF", "#FFD700", "#FF1493", "#9314FF"][i],
              animationDelay: `${i * 150}ms`,
              border: "2px solid #111",
            }}
          />
        ))}
      </div>

      <p className="text-xs text-gray-400">Usually takes 5–15 seconds</p>
    </div>
  );
}
