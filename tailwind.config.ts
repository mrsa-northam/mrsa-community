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
        brand: "var(--color-brand)",
        "brand-mid": "var(--color-brand-mid)",
        "brand-light": "var(--color-brand-light)",
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
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      borderWidth: {
        hairline: "0.5px"
      },
      boxShadow: {
        nav: "0 -8px 24px rgba(24, 24, 26, 0.06)"
      },
      maxWidth: {
        shell: "1152px"
      }
    }
  },
  plugins: []
};

export default config;
