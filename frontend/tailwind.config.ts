import type { Config } from "tailwindcss";

function withOpacity(varName: string) {
  return `rgb(var(${varName}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: withOpacity("--color-paper"),
        "paper-dim": withOpacity("--color-paper-dim"),
        card: withOpacity("--color-card"),
        teal: {
          DEFAULT: withOpacity("--color-teal"),
          dark: withOpacity("--color-teal-dark"),
        },
        gold: {
          DEFAULT: withOpacity("--color-gold"),
          soft: withOpacity("--color-gold-soft"),
        },
        ink: {
          DEFAULT: withOpacity("--color-ink"),
          soft: withOpacity("--color-ink-soft"),
        },
        brick: withOpacity("--color-brick"),
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-plex-sans)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
