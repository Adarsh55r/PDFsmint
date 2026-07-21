import type { Config } from "tailwindcss";

/**
 * Palette options considered:
 * 1. Slate + Teal  — cool, minimal, trustworthy (SELECTED — premium SaaS utility feel)
 * 2. Navy + Cyan    — corporate, high-contrast
 * 3. Charcoal + Indigo — modern startup, slightly warmer
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        // Explicit, cross-platform fallbacks so the UI renders consistently
        // even before the web font loads or if it fails (avoids per-browser
        // size/appearance differences from the vague `system-ui` keyword).
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        heading: [
          "var(--font-poppins)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        "soft-md":
          "0 4px 6px -1px rgb(15 23 42 / 0.05), 0 2px 4px -2px rgb(15 23 42 / 0.05)",
        "soft-lg":
          "0 10px 15px -3px rgb(15 23 42 / 0.06), 0 4px 6px -4px rgb(15 23 42 / 0.06)",
        "soft-xl":
          "0 20px 25px -5px rgb(15 23 42 / 0.08), 0 8px 10px -6px rgb(15 23 42 / 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
