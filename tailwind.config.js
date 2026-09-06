/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ===== Surface ladder (DESIGN.md) =====
        "surface": "#081326",
        "surface-dim": "#060e1d",
        "surface-container-lowest": "#040914",
        "surface-container-low": "#0c1a33",
        "surface-container": "#122547",
        "surface-container-high": "#193361",
        "surface-container-highest": "#21427c",
        "surface-bright": "#2b549e",
        "surface-variant": "#1c3d75",

        // ===== Outline =====
        "outline": "#4768a3",
        "outline-variant": "#223c6d",

        // ===== Text =====
        "on-surface": "#f0f5ff",
        "on-surface-variant": "#9cb4da",

        // ===== Primary (gold) =====
        "primary": "#fbbf24",
        "primary-container": "#f59e0b",
        "on-primary": "#451a03",
        "on-primary-container": "#78350f",
        "primary-fixed": "#fef3c7",
        "primary-fixed-dim": "#fbbf24",

        // ===== Secondary (cyan) =====
        "secondary": "#38bdf8",
        "secondary-container": "#153d6f",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#78350f",
        "secondary-fixed": "#fde68a",
        "secondary-fixed-dim": "#f59e0b",

        // ===== Tertiary (emerald) =====
        "tertiary": "#00e59b",
        "tertiary-container": "#00613f",
        "on-tertiary": "#003823",
        "tertiary-fixed": "#4bffb4",
        "tertiary-fixed-dim": "#00e299",

        // ===== Accents & states =====
        "ruby": "#f43f5e",
        "ruby-dark": "#881337",
        "emerald-gem": "#00c853",
        "emerald-gem-dark": "#00963e",
        "gold-glow": "#fcd34d",
        "gold-border": "#f59e0b",
        "error": "#f43f5e",
        "error-container": "#e11d48",

        // Interactive navy family (buttons, segmented controls)
        "navy-hi": "#24457e",
        "navy": "#19335f",
        "navy-lo": "#102242",
      },
      fontSize: {
        // ===== Type scale (DESIGN.md § Typography) =====
        "display-lg": ["26px", { lineHeight: "30px", letterSpacing: "-0.01em", fontWeight: "800" }],
        "headline-xl": ["20px", { lineHeight: "26px", letterSpacing: "-0.01em", fontWeight: "800" }],
        "headline-lg": ["18px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "800" }],
        "headline-md": ["17px", { lineHeight: "22px", letterSpacing: "-0.01em", fontWeight: "800" }],
        "headline-sm": ["15px", { lineHeight: "20px", letterSpacing: "-0.0025em", fontWeight: "700" }],
        "body-lg": ["15px", { lineHeight: "24px" }],
        "body-md": ["14px", { lineHeight: "22px" }],
        "body-sm": ["13px", { lineHeight: "20px" }],
        "label-lg": ["12px", { lineHeight: "16px", letterSpacing: "0.04em" }],
        "label-md": ["11px", { lineHeight: "16px", letterSpacing: "0.05em" }],
        "label-sm": ["10px", { lineHeight: "14px", letterSpacing: "0.06em" }],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        full: "9999px",
        // Design-system radii
        card: "1rem",
        control: "0.75rem",
      },
      spacing: {
        "space-xxs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.25rem",
        "space-xl": "1.5rem",
        "space-2xl": "2rem",
        "screen-margin-mobile": "1rem",
        "screen-margin-tablet": "1.5rem",
        "card-gutter": "0.75rem",
        "nav-bar-height": "4.75rem",
        "status-bar-height": "3.5rem",
      },
      maxWidth: {
        // Layout column for the whole app (DESIGN.md § Radius & Grid)
        screen: "32rem",
      },
      fontFamily: {
        "headline-xl": ["Rubik", "sans-serif"],
        "headline-lg": ["Rubik", "sans-serif"],
        "headline-md": ["Rubik", "sans-serif"],
        "headline-sm": ["Rubik", "sans-serif"],
        "label-lg": ["Rubik", "sans-serif"],
        "label-md": ["Rubik", "sans-serif"],
        "label-sm": ["Rubik", "sans-serif"],
        "body-lg": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        // ===== Elevation ladder (DESIGN.md § Elevation) =====
        "inset-well": "inset 0 2px 6px rgba(0,0,0,0.55)",
        "card": "0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)",
        "card-raised": "0 8px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
        "crown": "0 8px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 28px rgba(251,191,36,0.30)",

        // ===== Legacy bevels & glows (unchanged) =====
        "bevel-gold": "0 6px 0 #78350f, 0 12px 24px rgba(245,158,11,0.45)",
        "bevel-gold-active": "0 2px 0 #78350f, 0 4px 10px rgba(245,158,11,0.3)",
        "bevel-emerald": "0 4px 0 #00702e, 0 8px 20px rgba(0,200,83,0.4)",
        "bevel-emerald-active": "0 1px 0 #00702e, 0 3px 8px rgba(0,200,83,0.3)",
        "bevel-navy": "0 4px 0 #071224, 0 6px 16px rgba(0,0,0,0.5)",
        "bevel-ruby": "0 4px 0 #4c0519, 0 8px 18px rgba(225,29,72,0.35)",
        "card-glow": "0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
        "gold-aura": "0 0 20px rgba(251,191,36,0.4)",
        "cyan-aura": "0 0 20px rgba(0,210,255,0.4)",
        "emerald-aura": "0 0 20px rgba(16,185,129,0.5)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleUp: {
          "0%": { opacity: "0", transform: "scale(0.92) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.18s ease-out both",
        scaleUp: "scaleUp 0.24s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
      },
    },
  },
  plugins: [],
};