"use client";

import { useMemo } from "react";

const COLS = 15;
const ROWS = 7;
const SIZE = 200;
const HUES = [0, 310, 320, 330, 340, 350, 355];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export default function Doodles() {
  const kisses = useMemo(() => {
    const rand = seededRandom(77);
    const items = [];
    const TOTAL = ROWS * COLS;
    const SPACING = 220;
    for (let i = 0; i < TOTAL; i++) {
      // Place along diagonal lines going top-left to bottom-right
      const row = Math.floor(i / COLS);
      const col = i % COLS;
      // Shift each row diagonally
      const x = col * SPACING + row * (SPACING * 0.5) - (ROWS * SPACING * 0.5);
      const y = row * SPACING;
      items.push({
        top: `${y}px`,
        left: `${x}px`,
        rot: -25 + rand() * 50,
        opacity: 0.2 + rand() * 0.15,
        hue: HUES[Math.floor(rand() * HUES.length)],
      });
    }
    return items;
  }, []);

  return (
    <div className="doodles-layer">
      {kisses.map((k, i) => (
        <div
          key={i}
          className="doodle"
          style={{
            top: k.top,
            left: k.left,
            width: SIZE,
            height: SIZE,
            opacity: k.opacity,
            transform: `rotate(${k.rot}deg)`,
            filter: `hue-rotate(${k.hue}deg) saturate(0.8)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/lipstain.png"
            alt=""
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
