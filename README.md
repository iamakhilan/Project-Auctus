# Auctus ⚡

Auctus is a browser-based **gamified productivity RPG** that turns real-world work into quests, XP, streaks, rewards, focus sessions, and Citadel progression.

## What is implemented

- **Realm** — player overview, progression, habits, streak calendar heat intensity, and daily momentum.
- **Quests** — daily/bounty/epic missions, difficulty tiers (normal/hard/elite), search/filtering, procedural quest generation, and focus-session launch.
- **Focus Arena** — timed focus sessions with pause/resume, rewards, overcharge, and web audio soundscapes (binaural, cyber-rain, forest, white-noise).
- **Vault** — chest unlocks, dynamic loot tables, tiers (bronze/silver/gold/mythic), reward redemption, and treasury ledger.
- **Citadel** — progression/ascension, citadel engine mechanics, profile management, and schema-validated backup/restore.
- **Analytics** — focus velocity score, 7-day productivity trends, hourly distribution histogram, quest category breakdown, and CSV data export.
- **Achievements** — criteria evaluation engine, unlock fanfares, and persistent achievement locks.
- **Offline persistence** — multi-tab state broadcast channel with deduped sync events, atomic transaction runner, and resilient local storage with non-blocking error feedback.
- **Accessibility** — ARIA live regions, useFocusTrap modal isolation, semantic skip navigation, high-contrast focus rings, and shortcut search.

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Vitest + Testing Library tooling (160 tests across 27 test suites)
- Browser `localStorage` + BroadcastChannel persistence
- Web Audio API synthesizer
- Canvas Confetti for reward feedback

## Development

```bash
npm install
npm run dev    # http://localhost:5173
npm run lint
npm run type-check
npm test       # 160 tests
npm run build  # tsc + vite, code-split Citadel/Analytics
```

## Verification

```bash
npm run type-check
npm run lint
npm test
npm run build
```

`npm test` runs the Vitest suite once. `npm run build` performs TypeScript checking before the production Vite build.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `?` | Toggle help overlay (when not typing) |
| `Esc` | Close palette / help / onboarding |
| `Ctrl+K` / `Cmd+K` | Command palette (jump to tab or forge quest/habit/focus) |

All shortcuts are guarded to avoid firing while typing in inputs/textareas.

## Data and privacy

Auctus currently operates client-side. There is no application backend or authentication layer in this version. Game state remains in the browser'"'"'s local storage unless the user explicitly exports a backup.

The application owns its storage under the `auctus_duo_*` key namespace. Resetting Auctus data is scoped to those keys rather than clearing unrelated site data.

## Project structure

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

## Data flow

`GameStateContext` is single source of truth \u2192 `StorageService` (`auctus_duo_*` + `version:2.0`) syncs on every state slice via `useEffect`. `validateImportJson` guards restores before `importBackup`. Focus timer uses `focusIntervalRef` + `completeFocusSessionRef` to avoid stale closures. `useKeyboardShortcuts` is global (`?`/`Esc`/`Ctrl+K`). Persistence errors surface via `auctus:persistence-error` + `PersistenceErrorBridge` toast; corrupt entries are cleared automatically.

## Testing

- `src/utils/__tests__/validators.test.ts` \u2014 `isNonEmpty` / `isCostValid` / `clamp` / `sanitize`
- `src/services/__tests__/storage.test.ts` \u2014 `loadFromStorage`/`saveToStorage` roundtrip, corrupt JSON recovery, quota error feedback, backup version 2.0
- `src/utils/__tests__/stateSync.test.ts` \u2014 `syncChannel` nonce dedup, fallback JSON shape, persistence error events
- `src/utils/__tests__/gameplay.test.ts` \u2014 quest/habit completion, streak progression, currency/rewards, chest claiming, achievements, focus completion, persistence roundtrip, transaction queue
- `src/hooks/useKeyboardShortcuts.test.ts` \u2014 help/palette/escape with typing guard

## Performance

- Route-level code splitting: `CitadelView` + `AnalyticsDashboard` lazy \u2014 main bundle code-split
- Debounced quest search (200ms) + `useMemo` for filtered lists
- `focus-visible` ring + `prefers-reduced-motion` support

## Deployment

```bash
npm run build    # outputs to dist/
npm run preview  # serves dist on :4173 for smoke check
```

`dist/` is static \u2014 deploy to Vercel/Netlify/Cloudflare Pages. No env vars, no backend. Ensure `_headers` or `vercel.json` caches `assets/*` immutable if needed.

## Troubleshooting

- **Clipboard blocked:** Export falls back to file download (`auctus-backup-YYYY-MM-DD.json`).
- **Quota exceeded:** `saveToStorage` returns `false` and surfaces a non-blocking toast via `PersistenceErrorBridge`; previous save remains.
- **Import rejected:** Malformed JSON or failed schema validation shows inline error; existing save is untouched.
- **Multi-tab sync:** Delete events use `BroadcastChannel` with `localStorage` fallback and nonce dedup; duplicate/fallback double-delivery is suppressed.
