import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          hot: "#FF1493",
          light: "#FFD6E8",
          pale: "#FFF0F5",
        },
        y2k: {
          pink: "#FF1493",
          purple: "#9314FF",
          yellow: "#FFD700",
          lime: "#00FF41",
          blue: "#00BFFF",
          orange: "#FF6600",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      animation: {
        "slide-up": "slideUp 0.4s ease-out forwards",
        "wiggle": "wiggle 0.5s ease-in-out infinite",
        "marquee": "marquee 20s linear infinite",
        "bounce-slow": "bounce 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
