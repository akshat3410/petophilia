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
        
        // Warm Pastel Tokens
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          dark: "hsl(var(--primary-dark) / <alpha-value>)",
          soft: "hsl(var(--primary-soft) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          soft: "hsl(var(--accent-soft) / <alpha-value>)",
        },
        ice: "hsl(var(--ice) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        offer: "hsl(var(--offer) / <alpha-value>)",

        // Pastel Accents
        butter: "#F8D66D",
        pistachio: "#CFE8B8",
        blush: "#F7C7C9",
        lilac: "#D9C7F2",
        powder: "#BFDDEE",
        peach: "#FFD9B7",
        cocoa: "#4A2F22",
        chocolate: "#6B4636",
        caramel: "#C98B5A",
        cream: "#FFF8EC",
        "warm-white": "#FFFCF6",
        oat: "#F7EAD8",
        beige: "#F2DEC3",
        success: "#7AA95C",
        warning: "#D89B2B",
        error: "#C95C5C",
        sale: "#D94F70",

        // Mapped values to ensure backward compatibility
        teal: {
          DEFAULT: "#C98B5A", // maps to warm Caramel instead of cold teal
          deep: "#4A2F22",
          light: "#FFF8EC",
        },
        orange: {
          DEFAULT: "#D94F70",
          deep: "#C95C5C",
        },
        sand: {
          DEFAULT: "#FFF8EC",
          deep: "#F2DEC3",
        },
        ink: {
          DEFAULT: "#3A241A",
          soft: "#7A6253",
          muted: "#9B8475",
        },
        coral: {
          DEFAULT: "#D94F70",
          deep: "#C95C5C",
        },
        sage: "#CFE8B8",
        clay: "#FFF8EC",
        line: "hsl(var(--border) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Fraunces", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        serif: ["var(--font-fraunces)", "Fraunces", "serif"],
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
