# Technology Stack

**Analysis Date:** 2026-09-06

## Languages

**Primary:**
- TypeScript 5.6.3 — All application code (`src/**/*.ts`, `src/**/*.tsx`)
- TSX / JSX — React component tree

**Secondary:**
- JavaScript (ES Modules / CommonJS) — Configuration and build scripts (`postcss.config.js`, `tailwind.config.js`)
- CSS — Custom theme extensions, animations, button grammar (`src/index.css`)
- HTML — Entry template (`index.html`)

## Runtime

**Environment:**
- Browser: Modern evergreen browsers supporting ES2020+, Web Audio API (`AudioContext`), and `localStorage`
- Node.js: >= 20.x (Current dev environment: Node.js v24.14.0)

**Package Manager:**
- npm 11.9.0
- Lockfile: `package-lock.json` present (lockfileVersion 3)

## Frameworks

**Core:**
- React 18.3.1 — Client-side SPA rendering with Hooks & Context API
- ReactDOM 18.3.1 — DOM mounting

**Styling & UI:**
- Tailwind CSS 3.4.15 — Utility styling extended with Auctus game token palette
- PostCSS 8.4.49 & Autoprefixer 10.4.20 — CSS post-processing
- Lucide React 1.16.0 — Icon library (available alongside Google Material Symbols font)
- Canvas Confetti 1.9.4 — Victory celebrations & reward animations

**Audio:**
- Web Audio API (native browser `AudioContext`) — Zero-dependency procedural sound effects and binaural/rain atmospheric synthesizer (`src/utils/audioSynthesizer.ts`)

**Build/Dev:**
- Vite 5.4.11 (`@vitejs/plugin-react` 4.3.3) — Development server with HMR and production bundle builder
- TypeScript 5.6.3 (`tsc`) — Type checking (`tsc && vite build`)

## Key Dependencies

**Critical:**
- `react` & `react-dom` (18.3.1) — Single-page UI framework
- `tailwindcss` (3.4.15) — Design system tokens & utility classes
- `canvas-confetti` (1.9.4) — Visual reward particle explosions
- `lucide-react` (1.16.0) — Icon components

## Configuration

**Environment:**
- Fully client-side and local-first. No `.env` secrets required.
- Local persistence via browser `localStorage`.

**Build:**
- `tsconfig.json` — Target ES2020, strict type checking, bundler module resolution
- `vite.config.ts` — React plugin, dev port 5173, host enabled
- `tailwind.config.js` — Comprehensive game palette (gold, emerald, navy, ruby, cyan) and custom elevation shadows
- `postcss.config.js` — Tailwind and Autoprefixer plugins

## Platform Requirements

**Development:**
- Windows / macOS / Linux with Node.js 18+ and npm
- Port 5173 open for local dev server

**Production:**
- Static asset hosting (Vite SPA output in `dist/`)
- Deployable to static edge hosts (Vercel, Cloudflare Pages, Netlify, GitHub Pages) without server requirements

---

*Stack analysis: 2026-09-06*
*Update after major dependency changes*
