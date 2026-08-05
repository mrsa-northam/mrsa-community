import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        page: "var(--color-bg-page)",
        card: "var(--color-bg-card)",
        surface: "var(--color-bg-surface)",
        brand: "var(--brand-primary-text)",
        "brand-deep": "var(--brand-deep)",
        "brand-mid": "var(--color-brand-mid)",
        "brand-primary": "var(--brand-primary)",
        "brand-primary-text": "var(--brand-primary-text)",
        "brand-light": "var(--color-brand-light)",
        accent: "var(--accent)",
        "accent-tint": "var(--accent-tint)",
        "accent-ink": "var(--accent-ink)",
        urgent: "var(--urgent)",
        "urgent-tint": "var(--urgent-tint)",
        "urgent-ink": "var(--urgent-ink)",
        "accent-green": "var(--color-accent-green)",
        "accent-clay": "var(--color-accent-clay)",
        "accent-hard": "var(--color-accent-hard)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        line: "var(--color-border)",
        "line-strong": "var(--color-border-strong)",
        "rank-gold": "var(--color-rank-gold)",
        "rank-silver": "var(--color-rank-silver)",
        "rank-bronze": "var(--color-rank-bronze)"
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Manrope", "system-ui", "sans-serif"],
        serif: ["Manrope", "system-ui", "sans-serif"]
      },
      fontWeight: {
        light: "400",
        normal: "400",
        medium: "600",
        semibold: "700",
        bold: "800",
        extrabold: "800",
        black: "800"
      },
      fontSize: {
        display: ["34px", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "800" }],
        h1: ["24px", { lineHeight: "1.12", letterSpacing: "-0.035em", fontWeight: "800" }],
        h2: ["18px", { lineHeight: "1.22", letterSpacing: "-0.025em", fontWeight: "800" }],
        body: ["16px", { lineHeight: "1.5", letterSpacing: "0" }],
        caption: ["13px", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" }]
      },
      borderWidth: {
        hairline: "0.5px"
      },
      borderRadius: {
        card: "14px",
        surface: "18px",
        hero: "24px"
      },
      boxShadow: {
        nav: "0 -8px 24px rgba(24, 24, 26, 0.06)",
        card: "0 8px 20px rgba(24, 24, 26, 0.04)",
        hero: "0 24px 70px var(--brand-shadow-22)"
      },
      maxWidth: {
        shell: "1152px"
      }
    }
  },
  plugins: []
};

export default config;
