# Requirements: AUCTUS V2

**Defined:** 2026-09-06
**Core Value:** Real-world focus and task completion directly drive an authentic, persistent game loop that never loses progress or drifts timers.

## v1 Requirements (AUCTUS V2 Milestone)

### 1. Architecture & Domain Game Engine
- [x] **ARCH-01**: Domain game engine extracted into pure TypeScript functions independent of React (`calculateXp`, `calculateLevel`, `calculateReward`, `calculateStreak`, etc.).
- [x] **ARCH-02**: `GameStateContext` modularized with separated state slices to prevent cascade re-renders.
- [x] **ARCH-03**: All calculation modules 100% unit-tested with Vitest.

### 2. Time-Based Systems & Focus Arena
- [x] **TIME-01**: Focus Arena timer operates on wall-clock timestamps (`startedAt`, `endsAt`, `pausedAt`, `remainingDuration`).
- [x] **TIME-02**: Refreshing the browser or backgrounding the tab does not reset, desync, or lose active focus sessions.
- [x] **TIME-03**: Configurable focus durations (25m, 45m, 60m, custom), short/long breaks, pause, resume, cancel, and victory completion.
- [x] **TIME-04**: Overcharge burst mechanic with live XP/Coin yield multiplier calculations.

### 3. Persistence & Data Safety
- [x] **DATA-01**: Storage engine implements schema versioning (`storageVersion: 2`) with migration handlers for existing `v1` keys.
- [x] **DATA-02**: Safe JSON parsing with fallback defaults to prevent app crashes on corrupted storage.
- [x] **DATA-03**: JSON Data Export feature (download full user save state file).
- [x] **DATA-04**: JSON Data Import feature (upload and restore save state with validation).

### 4. Quest & Habit Engines
- [x] **QST-01**: Support for one-time bounties, daily recurring quests, custom categories (Study, Coding, Health, Personal, College, Project, Creative), and difficulty tiers (Tier I, II, III, Epic, Urgent).
- [x] **QST-02**: Quests track completion history, due dates, and streak contributions.
- [x] **HBT-01**: Dedicated Habit system with daily check-offs, individual streaks, best streaks, and completion history.
- [x] **HBT-02**: Habit milestone achievements (7d, 30d, 100d, 365d) granting XP and Citadel progression.

### 5. Economy & Chest Engines
- [x] **ECON-01**: Centralized transaction ledger tracking all currency movements (Coins, Mana Gems, Spire Shards) with reasons.
- [x] **ECON-02**: Strict balance validation preventing negative balances or accidental mutations.
- [x] **CHEST-01**: 4-slot chest deck with timestamp-anchored unlock timers (`unlockAt`), survival across refresh, and state transitions (`locked`, `unlocking`, `ready`, `opened`, `empty`).
- [x] **CHEST-02**: Balanced loot drops and victory reward modals.

### 6. Progression, Citadel & Achievements
- [x] **CIT-01**: Citadel power directly tied to real productivity telemetry (completed quests, focus minutes, habits, streaks).
- [x] **CIT-02**: Meaningful Citadel tiers with aesthetic unlocks and passive buffs.
- [x] **ACHV-01**: Activity-driven achievement engine evaluating milestones (First Quest, 7-Day Streak, 10 Hours Focused, Quest Master, etc.).

### 7. Telemetry, Analytics & Daily Summary
- [x] **ANLY-01**: Productivity analytics dashboard showing Today's XP, focus time, quests completed, streak status, and 7d/30d/90d historical trends.
- [x] **DSUM-01**: "Today's Run" daily summary modal / card detailing what was accomplished today.

### 8. UX Polish, Onboarding & Notifications
- [x] **ONBD-01**: 30-second first-run onboarding walkthrough explaining the core loop with skip option and persistent completion flag.
- [x] **NOTF-01**: Optional local browser notifications for completed focus sessions, chest unlock readiness, and streak danger.
- [x] **UX-01**: Complete state audit ensuring loading, empty, disabled, error, and keyboard focus states are handled.
- [x] **UX-02**: Mobile responsiveness verified across 360px to 1440px+ viewports with safe-area insets.

### 9. Static Quality, Testing & CI
- [x] **TEST-01**: Vitest and React Testing Library setup with high unit test coverage on all domain logic.
- [x] **QUAL-01**: TypeScript strict compilation passing with zero `any` workarounds.
- [x] **CI-01**: GitHub Actions workflow running typecheck, lint, test, and build.
- [x] **DOCS-01**: Comprehensive rewritten `README.md` with architecture, loop diagrams, and development guide.

## Out of Scope

| Feature | Reason |
|---|---|
| User Authentication (Firebase, Clerk, Supabase, OAuth) | Strictly single-user personal application. Zero login friction. |
| Multiplayer / Social / Guilds | Designed for personal self-mastery. |
| Mandatory Backend Cloud Server | AUCTUS is 100% local-first. |
| Generic Corporate SaaS UI Redesign | Must preserve dark navy/gold/emerald gaming aesthetic. |

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| ARCH-01, ARCH-02, ARCH-03 | Phase 1 & 2: Architecture & Game Engine | Completed |
| TIME-01, TIME-02, TIME-03, TIME-04 | Phase 3: Time Systems & Focus Arena | Completed |
| DATA-01, DATA-02, DATA-03, DATA-04 | Phase 4: Persistence & Migrations | Completed |
| QST-01, QST-02 | Phase 5: Quest Engine | Completed |
| HBT-01, HBT-02 | Phase 6: Habit Engine | Completed |
| ECON-01, ECON-02 | Phase 7: Economy Ledger | Completed |
| CHEST-01, CHEST-02 | Phase 8: Chest System | Completed |
| CIT-01, CIT-02, ACHV-01 | Phase 9: Citadel & Achievements | Completed |
| ANLY-01, DSUM-01 | Phase 10: Analytics & Daily Summary | Completed |
| ONBD-01, NOTF-01, UX-01, UX-02 | Phase 11: Onboarding, Notifications & UX | Completed |
| TEST-01, QUAL-01, CI-01, DOCS-01 | Phase 12: Testing, CI & Documentation | Completed |

---
*Requirements verified: 2026-09-06*
