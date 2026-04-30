import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        "bg-tint": "hsl(var(--bg-tint) / <alpha-value>)",
        teal: {
          DEFAULT: "hsl(var(--teal) / <alpha-value>)",
          deep: "hsl(var(--teal-deep) / <alpha-value>)",
          light: "hsl(var(--teal-light) / <alpha-value>)",
        },
        orange: {
          DEFAULT: "hsl(var(--orange) / <alpha-value>)",
          deep: "hsl(var(--orange-deep) / <alpha-value>)",
        },
        sand: {
          DEFAULT: "hsl(var(--sand) / <alpha-value>)",
          deep: "hsl(var(--sand-deep) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          soft: "hsl(var(--ink-soft) / <alpha-value>)",
          muted: "hsl(var(--ink-muted) / <alpha-value>)",
        },
        // keep old names so other components don't break
        coral: {
          DEFAULT: "hsl(var(--orange) / <alpha-value>)",
          deep: "hsl(var(--orange-deep) / <alpha-value>)",
        },
        sage: "hsl(var(--teal-light) / <alpha-value>)",
        clay: "hsl(var(--sand) / <alpha-value>)",
        line: "hsl(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-nunito)", "Nunito", "sans-serif"],
        sans: ["var(--font-nunito)", "Nunito", "sans-serif"],
        serif: ["var(--font-nunito)", "Nunito", "sans-serif"],
        mono: ["var(--font-space)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "20px",
        xl: "32px",
        "2xl": "48px",
        full: "9999px",
      },
      boxShadow: {
        "soft-sm": "0 2px 8px rgba(0,0,0,0.06)",
        "soft-md": "0 8px 24px rgba(0,0,0,0.08)",
        "soft-lg": "0 24px 60px rgba(0,0,0,0.10)",
        "soft-xl": "0 40px 100px rgba(0,0,0,0.14)",
        teal: "0 8px 24px rgba(27,188,212,0.35)",
        "teal-hover": "0 12px 32px rgba(27,188,212,0.45)",
        orange: "0 8px 20px rgba(245,131,42,0.35)",
        "orange-hover": "0 12px 28px rgba(245,131,42,0.45)",
        // keep old shadow names
        coral: "0 8px 20px rgba(245,131,42,0.35)",
        "coral-hover": "0 12px 28px rgba(245,131,42,0.45)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(.2,.8,.2,1) both",
        "float": "float 3s ease-in-out infinite",
        "float-delayed": "float 3s ease-in-out infinite 1.5s",
        "marquee": "marquee 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
