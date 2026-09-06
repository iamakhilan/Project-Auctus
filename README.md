<div align="center">

<img src="public/assets/crest.png" width="96" alt="Auctus Crest" />

# ⚔️ AUCTUS

### **Level up your real-world productivity.**

*Transform daily tasks, habits, and deep work into an engaging tactical RPG progression system.*

<br>

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 🌍 Overview

**Auctus** is a gamified productivity platform that turns your real life into a tactical RPG. Every task completed earns XP and coins, every focus session forges Focus Stones, and every streak builds your Citadel's power — all rendered in a rich, dark, gold-accented game world.

No backend, no accounts, no friction. Your entire progression is stored locally and privately on your device.

<br>

## 🗺️ The World

| Realm | What it does |
|---|---|
| 🏝️ **Realm** | Your home island — a living overview of your hero, chest slots unlocking in real time, and daily momentum. |
| 📜 **Quests** | Bounties, epics, and habits across five tiers (Common → Epic). Urgent quests glow red; streaks at risk ask for shields. |
| ⏱️ **Focus Arena** | A deep-work timer that mines Focus Stones. Pair a session with a quest, overcharge it, and choose your soundscape. |
| 💎 **Vault** | Chests that unlock over time, plus a Reward Bazaar where coins and gems buy real-life (IRL) or in-game rewards. |
| 🏰 **Citadel** | Your long-term legacy — tiers, power, and league rank that grow as your real life levels up. |

<br>

## ✨ Core Systems

- 🎯 **Tiered Quest Engine** — Common, Rare, Urgent, Epic & Tier I–III quests with XP + coin rewards
- 🔥 **Streaks & Shields** — build daily streaks, spend Streak Shields to protect them
- ⚡ **Focus Mining** — timer-driven sessions that accumulate XP/coins in real time
- 📦 **Timed Chest Unlocks** — Silver → Gold → Magical → Relic chests on countdown timers
- 🛒 **Reward Bazaar** — redeem currency for IRL or in-game rewards; define custom ones
- 💠 **Triple Economy** — Coins, Mana Gems, and Spire Shards each fuel different systems
- 🔊 **Procedural Audio** — synthesized soundscapes (Binaural, Cyber Rain, Forest Spire, White Noise) — zero audio files
- 💾 **Local-First Persistence** — everything saved in `localStorage`, instantly and privately

<br>

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- npm (or your package manager of choice)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/iamakhilan/Project-Auctus.git
cd Project-Auctus

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app opens at **`http://localhost:5173`** 🎮

### Production Build

```bash
npm run build    # typechecks + bundles to dist/
npm run preview  # serve the production build locally
```

<br>

## 🎨 Design System

Auctus uses a custom **Material-inspired token system** built on Tailwind 3.4:

| Token family | Purpose |
|---|---|
| `surface-*` / `on-surface` | Navy surface ladder + contrast-safe foreground colors |
| `primary` (amber) / `secondary` (cyan) / `tertiary` (emerald) | Semantic accent roles |
| `font-headline-*` (Rubik) / `font-body-*` (Plus Jakarta Sans) | Modular type scale with baked-in leading & tracking |
| `shadow-card` → `shadow-crown` | Consistent elevation ladder |
| `btn-gold` / `btn-navy` / `btn-emerald` … | Full button state machines — hover lift, bevel press, focus rings |

<br>

## 📂 Project Structure

```
Project-Auctus/
├── public/assets/          # Chests, crest, crown & island artwork
├── src/
│   ├── components/
│   │   ├── citadel/        # 🏰 Citadel view
│   │   ├── common/         # Reward modal & shared UI
│   │   ├── focus/          # ⏱️ Focus Arena & timer
│   │   ├── layout/         # Header HUD & bottom dock nav
│   │   ├── quests/         # 📜 Quest board & mission forge
│   │   ├── realm/          # 🏝️ Realm island view
│   │   └── vault/          # 💎 Chests & reward bazaar
│   ├── context/            # Global game state (React Context)
│   ├── types/              # TypeScript domain models
│   └── utils/              # Persistence & audio synthesis
├── tailwind.config.js      # Design tokens & theme
└── index.css               # Global styles & keyframes
```

<br>

## 🛠️ Tech Stack

- **[React 18](https://react.dev)** — UI runtime
- **[TypeScript 5](https://www.typescriptlang.org)** — type-safe domain models
- **[Vite 5](https://vite.dev)** — instant dev server & optimized builds
- **[Tailwind CSS 3.4](https://tailwindcss.com)** — token-driven styling
- **[lucide-react](https://lucide.dev)** — crisp iconography
- **[canvas-confetti](https://github.com/catdad/canvas-confetti)** — celebration moments ✨

<br>

## 🗺️ Roadmap

- [ ] Cloud sync & multi-device progression
- [ ] Guilds — shared quests with friends
- [ ] Seasonal leagues & ranked leaderboards
- [ ] PWA support for offline play

<br>

---

<div align="center">

**Forged with focus.** ⚔️ *Auctus — because your real life deserves an XP bar.*

</div>
