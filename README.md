# Auctus ⚡

Auctus is a browser-based **gamified productivity RPG** that turns real-world work into quests, XP, streaks, rewards, focus sessions, and Citadel progression.

> Active development happens on the `upgrade` branch. `main` is treated as protected/read-only during development.

## What is implemented

- **Realm** — player overview, progression, habits, and daily momentum.
- **Quests** — daily/bounty/epic missions, search/filtering, editing, deletion, and focus-session launch.
- **Focus Arena** — timed focus sessions with pause/resume, rewards, overcharge, and soundscapes.
- **Vault** — chest unlocks, loot claiming, reward redemption, and custom rewards.
- **Citadel** — progression/ascension, profile management, and data backup/restore.
- **Analytics** — productivity summaries, streak calendar, and progress insights.
- **Achievements** — automatic progress tracking and unlock rewards.
- **Offline persistence** — game state is stored locally in the browser.
- **Accessibility basics** — semantic buttons, labels, keyboard shortcuts, live toast notifications, and an application error boundary.

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Vitest + Testing Library tooling
- Browser `localStorage` persistence
- Web Audio API sound effects
- Canvas Confetti for reward feedback

## Development

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:5173` by default.

## Verification

```bash
npm run type-check
npm run lint
npm test
npm run build
```

`npm test` runs the Vitest suite once. `npm run build` performs TypeScript checking before the production Vite build.

## Data and privacy

Auctus currently operates client-side. There is no application backend or authentication layer in this version. Game state remains in the browser's local storage unless the user explicitly exports a backup.

The application owns its storage under the `auctus_duo_*` key namespace. Resetting Auctus data is scoped to those keys rather than clearing unrelated site data.

## Project structure

```text
src/
├── components/
│   ├── analytics/     # analytics dashboard and streak views
│   ├── citadel/       # profile, progression, backup/restore
│   ├── common/        # error boundary, onboarding, rewards, toasts
│   ├── focus/         # focus timer and soundscape UI
│   ├── layout/        # HUD and navigation
│   ├── quests/        # quest and habit management
│   ├── realm/         # main productivity dashboard
│   └── vault/         # chests and reward economy
├── context/           # central game-state orchestration
├── hooks/             # reusable browser/keyboard state hooks
├── services/          # local persistence and initial game data
├── types/             # shared domain types
└── utils/             # audio, confetti, and validation helpers
```

## Branch safety

For project upgrades, work only on `upgrade`:

```bash
git switch upgrade
```

Do not merge, rebase, reset, force-push, or otherwise modify `main` as part of upgrade work.
