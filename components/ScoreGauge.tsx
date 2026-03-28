"use client";

import { useEffect, useState } from "react";
import { getScoreColor, getScoreGlowClass } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  label: string;
}

export default function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const steps = 40;
      const increment = score / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(interval);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, 30);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(timer);
  }, [score]);

  // SVG gauge parameters
  const size = 200;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circle
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  const scoreColor = getScoreColor(score);
  const glowClass = getScoreGlowClass(score);

  // Get color for SVG
  const getSvgColor = () => {
    if (score >= 75) return "#00FF41";
    if (score >= 50) return "#facc15";
    if (score >= 25) return "#fb923c";
    return "#FF073A";
  };

  const getBackgroundArcColor = () => "rgba(255,255,255,0.08)";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size / 2 + 30 }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-180"
          style={{ marginTop: -(size / 2) }}
        >
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getBackgroundArcColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
          {/* Score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getSvgColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: "stroke-dashoffset 0.05s ease",
              filter: `drop-shadow(0 0 6px ${getSvgColor()})`,
            }}
          />
        </svg>

        {/* Score number in center */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-2"
          style={{ bottom: -10 }}
        >
          <span
            className={`text-5xl font-black tabular-nums ${scoreColor} ${glowClass}`}
            style={{
              textShadow: `0 0 20px ${getSvgColor()}`,
            }}
          >
            {animatedScore}
          </span>
          <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            out of 100
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <span
          className={`text-lg font-bold ${scoreColor} uppercase tracking-wide`}
        >
          {label}
        </span>
      </div>

      {/* Score bar labels */}
      <div className="flex justify-between w-full max-w-[200px] text-xs text-gray-600">
        <span>Run.</span>
        <span>Maybe.</span>
        <span>Yes!</span>
      </div>
    </div>
  );
}
