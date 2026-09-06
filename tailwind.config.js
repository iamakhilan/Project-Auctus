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
        // ===== Core 5-Color Palette =====
        deep: "#0c0d1a",
        light: "#f3f3fb",
        primary: {
          DEFAULT: "#3744c9",
          hover: "#4552db",
          dark: "#2a349c",
        },
        secondary: {
          DEFAULT: "#8d95e8",
          dim: "#757ed4",
          light: "#a8aff3",
        },
        accent: {
          DEFAULT: "#5763e8",
          hover: "#6b76ec",
          light: "#8d95e8",
        },

        // ===== Surface Ladder (Derived strictly from #0c0d1a with controlled tones) =====
        "surface": "#0c0d1a",
        "surface-dim": "#080912",
        "surface-container-lowest": "#06070e",
        "surface-container-low": "#111324",
        "surface-container": "#161930",
        "surface-container-high": "#1d2140",
        "surface-container-highest": "#242950",
        "surface-bright": "#2e3466",
        "surface-variant": "#1a1e3d",

        // ===== Outline & Borders =====
        "outline": "#8d95e8",
        "outline-variant": "rgba(141, 149, 232, 0.25)",

        // ===== Text Tokens =====
        "on-surface": "#f3f3fb",
        "on-surface-variant": "#8d95e8",

        // Interactive Navy/Slate family aliases mapped to palette
        "navy-hi": "#242950",
        "navy": "#161930",
        "navy-lo": "#111324",
      },
      fontSize: {
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
        "inset-well": "inset 0 2px 6px rgba(0,0,0,0.65)",
        "card": "0 4px 16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(141,149,232,0.15)",
        "card-raised": "0 8px 24px rgba(0,0,0,0.65), inset 0 1px 0 rgba(141,149,232,0.25)",
        "crown": "0 8px 24px rgba(0,0,0,0.65), inset 0 1px 0 rgba(141,149,232,0.25), 0 0 28px rgba(87,99,232,0.30)",
        "card-glow": "0 8px 24px rgba(0,0,0,0.65), inset 0 1px 0 rgba(141,149,232,0.20)",
        "primary-aura": "0 0 20px rgba(55,68,201,0.45)",
        "accent-aura": "0 0 20px rgba(87,99,232,0.45)",
        "secondary-aura": "0 0 20px rgba(141,149,232,0.35)",
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
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.18s ease-out both",
        scaleUp: "scaleUp 0.24s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
        slideUp: "slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};