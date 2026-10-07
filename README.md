# Auctus ⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/auctus.svg)](https://www.npmjs.com/package/auctus)
[![Test Suite](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/iamakhilan/Project-Auctus/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)

Auctus is a browser-based **gamified productivity RPG** that turns real-world work into quests, XP, streaks, rewards, focus sessions, and Citadel progression.

---

## ✨ Features

- **Realm** — Player overview, progression, habits, streak calendar heat intensity, and daily momentum.
- **Quests** — Daily/bounty/epic missions, difficulty tiers (normal/hard/elite), search/filtering, procedural quest generation, and focus-session launch.
- **Focus Arena** — Timed focus sessions with pause/resume, rewards, overcharge, and web audio soundscapes (binaural, cyber-rain, forest, white-noise).
- **Vault** — Chest unlocks, dynamic loot tables, tiers (bronze/silver/gold/mythic), reward redemption, and treasury ledger.
- **Citadel** — Progression/ascension, citadel engine mechanics, profile management, and schema-validated backup/restore.
- **Analytics** — Focus velocity score, 7-day productivity trends, hourly distribution histogram, quest category breakdown, and CSV data export.
- **Achievements** — Criteria evaluation engine, unlock fanfares, and persistent achievement locks.
- **Offline persistence** — Multi-tab state broadcast channel with deduped sync events, atomic transaction runner, and resilient local storage with non-blocking error feedback.
- **Accessibility** — ARIA live regions, useFocusTrap modal isolation, semantic skip navigation, high-contrast focus rings, and shortcut search.

---

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite 5**
- **Tailwind CSS 3**
- **Vitest** + **Testing Library** (160 tests across 27 test suites)
- Browser `localStorage` + `BroadcastChannel` persistence
- Web Audio API synthesizer
- Canvas Confetti for reward feedback

---

## 💻 Development

### Prerequisites

- Node.js >= 18
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/iamakhilan/Project-Auctus.git
cd Project-Auctus

# Install dependencies
npm install
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `http://localhost:5173` |
| `npm run build` | Build for production (`tsc --noEmit && vite build`) |
| `npm run preview` | Preview production build locally at `:4173` |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Run Vitest in watch mode |

---

## 🧪 Testing

Run the full test suite:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

### Test Files

- `src/utils/__tests__/validators.test.ts` – `isNonEmpty` / `isCostValid` / `clamp` / `sanitize`
- `src/services/__tests__/storage.test.ts` – `loadFromStorage`/`saveToStorage` roundtrip, corrupt JSON recovery, quota error feedback, backup version 2.0
- `src/utils/__tests__/stateSync.test.ts` – `syncChannel` nonce dedup, fallback JSON shape, persistence error events
- `src/utils/__tests__/gameplay.test.ts` – quest/habit completion, streak progression, currency/rewards, chest claiming, achievements, focus completion, persistence roundtrip, transaction queue
- `src/hooks/useKeyboardShortcuts.test.ts` – help/palette/escape with typing guard

---

## 🚀 Deployment

Auctus is a static site; deploy to any static hosting provider.

```bash
# Build for production
npm run build

# Outputs to ./dist/
# Deploy the contents of dist/ to Vercel, Netlify, Cloudflare Pages, etc.
```

> **Note**: No environment variables or backend required. Ensure your host caches `assets/*` immutable if needed (e.g., via `_headers` or `vercel.json`).

---

## 🐞 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Clipboard blocked** | Export falls back to file download (`auctus-backup-YYYY-MM-DD.json`). |
| **Quota exceeded** | `saveToStorage` returns `false` and surfaces a non-blocking toast via `PersistenceErrorBridge`; previous save remains. |
| **Import rejected** | Malformed JSON or failed schema validation shows inline error; existing save is untouched. |
| **Multi-tab sync** | Delete events use `BroadcastChannel` with `localStorage` fallback and nonce dedup; duplicate/fallback double-delivery is suppressed. |

---

## 📖 Data & Privacy

Auctus operates entirely client‑side. There is no application backend or authentication layer. Game state persists in the browser's `localStorage` under the `auctus_duo_*` namespace unless the user exports a backup.

Resetting Auctus data only affects the `auctus_duo_*` keys, leaving other site data untouched.

---

## 🏗️ Project Structure

```text
src/
├── components/
│   ├── analytics/     # analytics dashboard and streak views
│   ├── citadel/       # profile, progression, backup/restore
│   ├── common/        # error boundary, onboarding, rewards, toasts, persistence bridge
│   ├── focus/         # focus timer and soundscape UI
│   ├── layout/        # HUD and navigation
│   ├── quests/        # quest and habit management
│   ├── realm/         # main productivity dashboard (demo schedule)
│   └── vault/         # chests and reward economy
├── context/           # central game-state orchestration
├── hooks/             # reusable browser/keyboard state hooks
├── services/          # local persistence and initial game data
├── types/             # shared domain types
└── utils/             # audio, confetti, date, sync, and validation helpers
```

---

## 📄 Data Flow

`GameStateContext` is the single source of truth → `StorageService` (`auctus_duo_*` + `version:2.0`) syncs on every state slice via `useEffect`. `validateImportJson` guards restores before `importBackup`. Focus timer uses `focusIntervalRef` + `completeFocusSessionRef` to avoid stale closures. `useKeyboardShortcuts` is global (`?`/`Esc`/`Ctrl+K`). Persistence errors surface via `auctus:persistence-error` + `PersistenceErrorBridge` toast; corrupt entries are cleared automatically.

---

## 📝 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- Inspired by gamified productivity apps and Duolingo’s design system.
- Built with ❤️ using React, TypeScript, Vite, and Tailwind CSS.

---

**Enjoy turning your work into an adventure!** 🎮✨