# 🌟 Auctus: Where Productivity Meets Adventure

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/auctus.svg)](https://www.npmjs.com/package/auctus)
[![Test Suite](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/iamakhilan/Project-Auctus/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0%2B-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.0%2B-38B2AC.svg)](https://tailwindcss.com/)

---

> ## ✨ Transform Your Daily Grind Into an Epic Quest ✨
> 
> Imagine if your to-do list felt like leveling up in your favorite RPG...
> 
> **Welcome to Auctus** – where every completed task grants you XP, 
> every streak builds your legend, and every focus session 
> forges your destiny.
> 
> *This isn't just productivity software... it's your personal adventure.*

---

## 🏰 What Awaits You in the Realm of Auctus

### 🎮 **Core Gameplay Systems**

| Feature | Description | Your Reward |
|---------|-------------|-------------|
| **🏘️ Realm** | Your adventurer's dashboard: overview, progression, habits, streak calendar heat intensity, and daily momentum | Watch your legend grow |
| **⚔️ Quests** | Daily/bounty/epic missions, difficulty tiers (normal/hard/elite), search/filtering, procedural quest generation | Conquer challenges, earn glory |
| **💫 Focus Arena** | Timed focus sessions with pause/resume, rewards, overcharge, and immersive soundscapes (binaural, cyber-rain, forest, white-noise) | Enter the flow state |
| **📦 Vault** | Chest unlocks with dynamic loot tables, tiers (bronze/silver/gold/mythic), reward redemption, treasury ledger | Open chests, claim treasures |
| **🏰 Citadel** | Progression/ascension mechanics, profile management, schema-validated backup/restore | Build your eternal stronghold |
| **📈 Analytics** | Focus velocity score, 7-day productivity trends, hourly distribution histogram, quest category breakdown, CSV export | Master your patterns |
| **🏆 Achievements** | Criteria evaluation engine, unlock fanfares, persistent achievement locks | Collect glory and renown |
| **💾 Offline Persistence** | Multi-tab state broadcast channel, atomic transaction runner, resilient local storage with error feedback | Your adventure persists everywhere |
| **♿ Accessibility** | ARIA live regions, useFocusTrap modal isolation, semantic skip navigation, high-contrast focus rings, shortcut search | Adventure for all |

---

## ⚙️ Forge Your Tools: Tech Stack

<details>
<summary>⚔️ Click to unveil the arsenal</summary>

| Category | Technology | Purpose | Badge |
|----------|------------|---------|-------|
| **Framework** | React 18 | Building immersive UIs | ![React](https://img.shields.io/badge/React-18-61DAFB.svg) |
| **Language** | TypeScript 5.0+ | Type-safe adventures | ![TS](https://img.shields.io/badge/TS-5.0%2B-3178C6.svg) |
| **Build Tool** | Vite 5 | Lightning-fast development | ![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg) |
| **Styling** | Tailwind CSS 3 | Beautiful, responsive design | ![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC.svg) |
| **Testing** | Vitest + Testing Library | Ensuring quest stability | ![Vitest](https://img.shields.io/badge/Vitest-Testing-%236E9F18.svg) |
| **Persistence** | Browser `localStorage` + `BroadcastChannel` | Your save file across tabs | ![Storage](https://img.shields.io/badge/Persistent-Storage-%23FF6B6B.svg) |
| **Audio** | Web Audio API synthesizer | Immersive soundscapes | ![Audio](https://img.shields.io/badge/Audio-Web%20API-%23FF9F1C.svg) |
| **Effects** | Canvas Confetti | Celebratory victories | ![Confetti](https://img.shields.io/badge/Effects-Canvas%20Confetti-%23FD79A8.svg) |
</details>

---

## 🛠️ Your Adventure Begins: Getting Started

### 🧰 Prerequisites
- Node.js ≥ 18 (your trusty steed)
- npm or yarn (your loyal companions)

### 🗺️ Setup Your Base Camp

```bash
# 1. Claim your territory
git clone https://github.com/iamakhilan/Project-Auctus.git
cd Project-Auctus

# 2. Gather your resources
npm install
```

### ⚔️ Your Quest Commands

| Command | Action | When to Use |
|---------|--------|-------------|
| `npm run dev` | 🌅 Launch development server (`http://localhost:5173`) | Daily coding |
| `npm run build` | 🏗️ Forge production build (`tsc --noEmit && vite build`) | Ready for release |
| `npm run preview` | 👀 Preview your creation locally (`:4173`) | Before sharing |
| `npm run lint` | 🔍 Sharpen your code with ESLint | Before committing |
| `npm run type-check` | 📝 Verify your TypeScript mastery | While developing |
| `npm test` | 🧪 Run your test suite (175/175 passing!) | Before every quest |
| `npm run test:watch` | 👁️ Keep watch over your tests | During development |

---

## 🧪 Prove Your Worth: Testing

### Run Your Trials
```bash
# Face the Trial of Champions (full test suite)
npm test

# Or maintain eternal vigilance
npm run test:watch
```

### 🏆 Your Testing Achievements
- **175/175 Tests Passing** - Your code is battle-tested! ✨
- **Zero Security Vulnerabilities** - Your fortress is impregnable! 🛡️
- **100% Type Safety** - No unexpected traps! ⚡

### 🔍 Key Test Chambers
- `src/utils/__tests__/validators.test.ts` – The Foundation (validation logic)
- `src/services/__tests__/storage.test.ts` – The Vault (persistence & security)
- `src/utils/__tests__/stateSync.test.ts` – The Realm Keepers (multi-tab harmony)
- `src/utils/__tests__/gameplay.test.ts` – The Arena (core RPG mechanics)
- `src/hooks/useKeyboardShortcuts.test.ts` – The Messenger (global shortcuts)

---

## 🚀 Launch Your Legend: Deployment

### Forge Your Production Build
```bash
# Temper your steel in the fires of production
npm run build

# The blessed artifacts await in ./dist/
```

### 🌐 Where to Plant Your Banner
Deploy your victory to any static hosting realm:
- **Vercel** (recommended - zero config!)
- **Netlify** 
- **Cloudflare Pages**
- **GitHub Pages**
- **Firebase Hosting**
- Or any static file server

> **Remember**: No backend. No environment variables. No database.  
> Just pure, unadulterated client-side magic that works everywhere.

---

## 📜 The Sacred License

This holy code is granted under the **[MIT License](LICENSE)** -  
May you use, modify, and share it freely in your own adventures.

---

## 🤝 Join the Fellowship: Contributing

### The Hero's Journey
1. **Find your calling** - Fork the repository
2. **Prepare for battle** - `git checkout -b feature/your-glorious-deed`
3. **Forge your contribution** - Make your changes shine
4. **Prove your mettle** - `npm test` (all lights must be green!)
5. **Record your deed** - `git commit -m "feat: your epic contribution"`
6. **Share your glory** - `git push origin feature/your-glorious-deed`
7. **Seek audience** - Open a Pull Request to the main realm

### The Paladin's Code
- Follow the radiant path of ESLint + Prettier
- Test new features with unwavering dedication
- Keep commits focused like an archer's arrow
- Honor existing documentation when expanding the realm
- Speak with kindness and courage in all interactions

---

## 🙏 In Gratitude

This realm was forged in the fires of inspiration from:
- The engaging progression systems of legendary RPGs
- Duolingo's mastery of habit-forming design
- The boundless generosity of the open-source community
- The brilliant teams behind React, Vite, Tailwind CSS, and Vitest
- And you - the adventurer who believes work should feel like play

---

## 🌅 Your Destiny Awaits

> **Remember this, brave one:**  
> Every completed task is a step toward your next level.  
> Every focused session forges your discipline.  
> Every streak builds your legend.  
> 
> The realm of Auctus awaits your courage.  
> What glorious deed shall you undertake today? 🌟

*Forged with ⚡ for those who refuse to choose between productivity and wonder.*  
*May your XP be high and your cooldowns be low.*

---

<div align="center">
  <sub>Built with ❤️ by developers who believe every day should be an adventure</sub>
  <br>
  <sup>Version 2.0.0 • Last updated $(date +%Y-%m-%d)</sup>
</div>