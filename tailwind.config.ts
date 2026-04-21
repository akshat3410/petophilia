import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        lg: "3rem",
      },
      screens: {
        "2xl": "1360px",
      },
    },
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        "bg-tint": "hsl(var(--bg-tint) / <alpha-value>)",
        sage: {
          DEFAULT: "hsl(var(--sage) / <alpha-value>)",
          deep: "hsl(var(--sage-deep) / <alpha-value>)",
        },
        clay: {
          DEFAULT: "hsl(var(--clay) / <alpha-value>)",
          deep: "hsl(var(--clay-deep) / <alpha-value>)",
        },
        coral: {
          DEFAULT: "hsl(var(--coral) / <alpha-value>)",
          deep: "hsl(var(--coral-deep) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          soft: "hsl(var(--ink-soft) / <alpha-value>)",
          muted: "hsl(var(--ink-muted) / <alpha-value>)",
        },
        line: "hsl(var(--line) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "12px",
        DEFAULT: "16px",
        lg: "24px",
        xl: "32px",
      },
      boxShadow: {
        "soft-sm": "0 2px 8px rgba(43,43,43,0.04)",
        "soft-md": "0 8px 24px rgba(43,43,43,0.06)",
        "soft-lg": "0 24px 60px rgba(43,43,43,0.08)",
        "soft-xl": "0 40px 100px rgba(43,43,43,0.12)",
        coral: "0 8px 20px rgba(242,140,140,0.28)",
        "coral-hover": "0 12px 28px rgba(242,140,140,0.36)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.42s cubic-bezier(.2,.8,.2,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
