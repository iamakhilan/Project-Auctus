# Roadmap: AUCTUS V2 Upgrade

## Overview

This roadmap transforms AUCTUS from a prototype into an authentic, production-quality personal productivity RPG. Work is structured into 12 progressive phases following GSD Core methodology: foundations and test harness first, pure domain engine extraction, timestamp-anchored timer reliability, robust persistence with migrations, followed by gameplay features (quests, habits, focus, economy, chests, citadel, achievements, analytics), and concluding with UX polish, CI, and documentation.

## Phases

- [ ] **Phase 1: Test Harness & Quality Setup** — Install Vitest, React Testing Library, ESLint rules, and verify testing infrastructure.
- [ ] **Phase 2: Game Engine & Domain Extraction** — Extract pure, deterministic game logic (XP, levels, formulas, rewards, streaks) into testable domain modules.
- [ ] **Phase 3: Timestamp Timing Engine & Focus Arena** — Replace interval-based state with timestamp-anchored timers (`startedAt`, `endsAt`) that survive tab suspension and page refresh.
- [ ] **Phase 4: Robust Persistence & Migrations** — Implement versioned `localStorage` engine (`v1 -> v2` migrations), corruption recovery, and JSON export/import.
- [ ] **Phase 5: Enhanced Quest Engine** — Build support for one-time bounties, daily quests, recurring tasks, categories, and completion history.
- [ ] **Phase 6: Habit Engine & Milestones** — Implement daily habit tracking, individual streaks, and milestone achievements (7d, 30d, 100d, 365d).
- [ ] **Phase 7: Economy Ledger & Treasury** — Implement transaction ledger for Coins, Mana Gems, and Spire Shards with audit reasons and balance safety.
- [ ] **Phase 8: Chest Loot Deck System** — Upgrade 4-slot chest deck with timestamp unlocks, accurate countdowns, and balanced loot drops.
- [ ] **Phase 9: Citadel Progression & Achievements Engine** — Connect real productivity telemetry to Citadel power, tier upgrades, and activity-driven achievements.
- [ ] **Phase 10: Telemetry, Analytics & Daily Summary** — Build productivity analytics dashboard (7d/30d/90d trends) and "Today's Run" summary.
- [ ] **Phase 11: Onboarding, Notifications & UX Polish** — Add 30s first-run onboarding, local browser notifications, accessibility, and mobile layout checks.
- [ ] **Phase 12: CI Pipeline, Build Verification & README** — Add GitHub Actions CI workflow, strict typecheck validation, and full README rewrite.

## Phase Details

### Phase 1: Test Harness & Quality Setup
**Goal**: Establish a modern, fast test framework and linting/typechecking baseline so subsequent phases can be built with test-driven verification.
**Requirements**: TEST-01, QUAL-01
**Success Criteria**:
  1. `npm test` runs Vitest and executes a sample test suite successfully.
  2. `npm run build` and `tsc --noEmit` pass with zero errors.

### Phase 2: Game Engine & Domain Extraction
**Goal**: Decouple game calculations from React components/context into pure, deterministic domain modules.
**Depends on**: Phase 1
**Requirements**: ARCH-01, ARCH-02, ARCH-03
**Success Criteria**:
  1. Pure domain functions exist for XP, level calculation, quest reward calculation, streak calculation, and loot yields.
  2. All domain functions have unit tests with high test coverage.
  3. `GameStateContext` delegates to domain modules rather than embedding inline game rules.

### Phase 3: Timestamp Timing Engine & Focus Arena
**Goal**: Make all timers (focus sessions, breaks, overcharge) timestamp-based and resilient against page reloads and tab backgrounding.
**Depends on**: Phase 2
**Requirements**: TIME-01, TIME-02, TIME-03, TIME-04
**Success Criteria**:
  1. Active focus session time is calculated via `endsAt - Date.now()`.
  2. Reloading the browser during a focus session resumes the exact remaining time without resetting.
  3. Pausing, resuming, overcharging, and completing focus sessions work seamlessly.

### Phase 4: Robust Persistence & Migrations
**Goal**: Protect user progress with versioned schemas, migration handlers, safe parsing, and full export/import.
**Depends on**: Phase 3
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria**:
  1. Storage schema version 2 introduced with automated migration for existing `auctus_*_v1` data.
  2. User can export complete game data to a `.json` file and import it back with integrity validation.
  3. Corrupted localStorage values gracefully fall back to defaults without crashing the application.

### Phase 5: Enhanced Quest Engine
**Goal**: Upgrade the Quest subsystem into a full-featured personal productivity task engine.
**Depends on**: Phase 4
**Requirements**: QST-01, QST-02
**Success Criteria**:
  1. User can create one-time bounties, daily recurring quests, and filter by categories (Study, Coding, Health, Personal, College, Project, Creative).
  2. Quests track completion history, due dates, and streak contributions.

### Phase 6: Habit Engine & Milestones
**Goal**: Provide dedicated daily habit tracking integrated with the AUCTUS progression loop.
**Depends on**: Phase 5
**Requirements**: HBT-01, HBT-02
**Success Criteria**:
  1. User can track daily habits with check-offs, individual streaks, and best streak records.
  2. Completing habits awards XP, contributes to Citadel power, and triggers milestone bonuses (7d, 30d, 100d).

### Phase 7: Economy Ledger & Treasury
**Goal**: Formalize the 3-currency economy with an auditable transaction ledger and balance guards.
**Depends on**: Phase 6
**Requirements**: ECON-01, ECON-02
**Success Criteria**:
  1. Every currency transaction records a ledger entry (`amount`, `currency`, `reason`, `timestamp`).
  2. Balance checks prevent overspending or negative balances across all currencies.

### Phase 8: Chest Loot Deck System
**Goal**: Perfect the 4-slot chest deck with timestamp unlock timers and balanced rewards.
**Depends on**: Phase 7
**Requirements**: CHEST-01, CHEST-02
**Success Criteria**:
  1. Chest unlock countdowns survive page reload and tab suspension.
  2. Chest states (`locked`, `unlocking`, `ready`, `opened`, `empty`) transition smoothly with tactile UI feedback.

### Phase 9: Citadel Progression & Achievements Engine
**Goal**: Establish Citadel as the player's persistent base powered by real productivity achievements.
**Depends on**: Phase 8
**Requirements**: CIT-01, CIT-02, ACHV-01
**Success Criteria**:
  1. Real activities (focus time, quests, habits, streaks) feed Citadel power and unlock tier upgrades.
  2. Achievements unlock based on real telemetry data and award trophies/shards.

### Phase 10: Telemetry, Analytics & Daily Summary
**Goal**: Provide clear insight into personal productivity through historical trends and daily run summaries.
**Depends on**: Phase 9
**Requirements**: ANLY-01, DSUM-01
**Success Criteria**:
  1. Analytics view displays Today's XP, focus time, quest rate, and 7d/30d/90d charts.
  2. "Today's Run" summary gives an immediate overview of daily accomplishments.

### Phase 11: Onboarding, Notifications & UX Polish
**Goal**: Ensure first-time clarity, optional local alerts, accessibility, and responsive perfection.
**Depends on**: Phase 10
**Requirements**: ONBD-01, NOTF-01, UX-01, UX-02
**Success Criteria**:
  1. 30-second onboarding modal explains the core loop with a skip option and persistent status.
  2. Local browser notifications alert when focus sessions complete or chests are ready.
  3. Mobile layouts tested and verified from 360px to 1440px+.

### Phase 12: CI Pipeline, Build Verification & README
**Goal**: Lock in quality with automated GitHub Actions and complete documentation.
**Depends on**: Phase 11
**Requirements**: CI-01, DOCS-01, QUAL-01
**Success Criteria**:
  1. GitHub Actions CI workflow runs typecheck, lint, tests, and build.
  2. `README.md` completely rewritten with product explanation, loop diagram, architecture, and dev setup.
  3. Production build succeeds cleanly.

## Progress

| Phase | Plans Complete | Status | Completed |
|---|---|---|---|
| 1. Test Harness & Quality Setup | 0/1 | Not started | - |
| 2. Game Engine & Domain Extraction | 0/2 | Not started | - |
| 3. Timestamp Timing Engine & Focus Arena | 0/2 | Not started | - |
| 4. Robust Persistence & Migrations | 0/2 | Not started | - |
| 5. Enhanced Quest Engine | 0/2 | Not started | - |
| 6. Habit Engine & Milestones | 0/2 | Not started | - |
| 7. Economy Ledger & Treasury | 0/1 | Not started | - |
| 8. Chest Loot Deck System | 0/1 | Not started | - |
| 9. Citadel Progression & Achievements Engine | 0/2 | Not started | - |
| 10. Telemetry, Analytics & Daily Summary | 0/2 | Not started | - |
| 11. Onboarding, Notifications & UX Polish | 0/2 | Not started | - |
| 12. CI Pipeline, Build Verification & README | 0/1 | Not started | - |

---
*Roadmap defined: 2026-09-06*
