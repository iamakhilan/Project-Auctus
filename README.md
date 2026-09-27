# Auctus ⚡

Auctus is a browser-based **gamified productivity RPG** that turns real-world work into quests, XP, streaks, rewards, focus sessions, and Citadel progression.

> Active development happens on the `upgrade` branch. `main` is treated as protected/read-only during development.

## What is implemented

- **Realm** — player overview, progression, habits, streak calendar heat intensity, and daily momentum.
- **Quests** — daily/bounty/epic missions, difficulty tiers (normal/hard/elite), search/filtering, procedural quest generation, and focus-session launch.
- **Focus Arena** — timed focus sessions with pause/resume, rewards, overcharge, and web audio soundscapes (binaural, cyber-rain, forest, white-noise).
- **Vault** — chest unlocks, dynamic loot tables, rarity tiers (common, rare, epic, legendary), reward redemption, and treasury ledger.
- **Citadel** — progression/ascension, citadel engine mechanics, profile management, and schema-validated backup/restore.
- **Analytics** — focus velocity score, 7-day productivity trends, hourly distribution histogram, quest category breakdown, and CSV data export.
- **Achievements** — criteria evaluation engine, unlock fanfares, and persistent achievement locks.
- **Offline persistence** — multi-tab state broadcast channel, atomic transaction runner, and local storage safety.
- **Accessibility** — ARIA live regions, useFocusTrap modal isolation, semantic skip navigation, high-contrast focus rings, and shortcut search.

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- Vitest + Testing Library tooling (99 tests across 16 test suites)
- Browser `localStorage` + BroadcastChannel persistence
- Web Audio API synthesizer
- Canvas Confetti for reward feedback

## Development

```bash
npm install
npm run dev    # http://localhost:5173
npm run lint
npm run type-check
npm test       # 32 tests
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

## Upgrade changelog (since `2ca8d29`)

- Focus traps + `Esc`/overlay close on all modals (forge, vault, onboarding, reward, daily summary) + skip-link + `aria-current` nav + `progressbar`/`timer` live regions
- Inline validation (forge modals) replacing `alert()`, file-based backup import, clipboard fallback to download
- Route-level code splitting: Citadel + Analytics lazy (~46k split, main 273k)
- Debounced search + `button type="button"` safety + label `htmlFor` + `aria-label` on ledger/import
- Storage emoji fix (?? → 🎮🏆), vault a11y, analytics empty-state copy, header semantic button
- Tooling: eslint + vitest + deduped suites (32 tests), type/lint/build green

## Data flow

`GameStateContext` is single source of truth → `StorageService` (`auctus_duo_*` + `version:2.0`) syncs on every state slice via `useEffect`. `validateImportJson` guards restores before `importBackup`. Focus timer uses `focusIntervalRef` + `completeFocusSessionRef` to avoid stale closures. `useKeyboardShortcuts` is global (`?`/`Esc`/`Ctrl+K`).

## Testing

- `src/utils/__tests__/validators.test.ts` — `isNonEmpty` / `isCostValid` / `clamp` / `sanitize`
- `src/services/__tests__/storage.test.ts` — `loadFromStorage`/`saveToStorage` roundtrip, corrupt JSON, quota errors, backup version 2.0
- `src/hooks/useKeyboardShortcuts.test.ts` — help/palette/escape with typing guard

## Performance

- Route-level code splitting: `CitadelView` (21k) + `AnalyticsDashboard` (26k) lazy — main bundle ~276k gzip 80k
- Debounced quest search (200ms) + `useMemo` for filtered lists
- `focus-visible` ring + `prefers-reduced-motion` support

## Deployment

```bash
npm run build    # outputs to dist/
npm run preview  # serves dist on :4173 for smoke check
```

`dist/` is static — deploy to Vercel/Netlify/Cloudflare Pages. No env vars, no backend. Ensure `_headers` or `vercel.json` caches `assets/*` immutable if needed.

## Troubleshooting

- **Clipboard blocked:** Export falls back to file download (`auctus-backup-YYYY-MM-DD.json`).
- **Quota exceeded:** `saveToStorage` is quota-safe; failed writes are ignored, previous save remains. Consider exporting and clearing old data.
- **Import rejected:** Malformed JSON or missing `profile/quests` keys shows inline error; existing save is untouched.





