# AUCTUS V2 — Personal Productivity RPG

## What This Is

AUCTUS is a personal, production-quality productivity RPG where real-world actions directly power a persistent character and Citadel progression system. It is strictly local-first and tailored for a single individual with zero login, authentication, or cloud dependencies.

## Core Value

Real-world focus and task completion directly drive an authentic, persistent game loop (Plan → Quest → Focus → Complete → Earn XP/Currencies → Level Up → Upgrade Base → Return Tomorrow) that never loses progress or drifts timers.

## Requirements

### Validated

- ✓ Dark Navy / Gold / Emerald / Cyan gaming visual identity (`src/index.css`, `tailwind.config.js`)
- ✓ Tactical 3D beveled button grammar and glowing cards
- ✓ Web Audio procedural sound effects & synthesizer (`src/utils/audioSynthesizer.ts`)
- ✓ 5 primary view surfaces: Realm, Quests, Focus Arena, Vault, Citadel
- ✓ Basic localStorage seed state and persistence (`src/utils/storage.ts`)

### Active (AUCTUS V2 Upgrade Scope)

- [ ] **CORE-01**: Decoupled domain game engine for XP, levels, ranks, streaks, loot, and rewards
- [ ] **CORE-02**: Timestamp-anchored timing systems (`startedAt`, `endsAt`) immune to browser sleep/refresh/throttle
- [ ] **CORE-03**: Versioned `localStorage` engine with schema migrations (`v1 -> v2`), error recovery, and JSON export/import
- [ ] **QUEST-01**: Full Quest engine supporting one-time bounties, daily quests, recurring tasks, categories, and difficulty yields
- [ ] **HABIT-01**: Dedicated Habit system with daily completions, individual streaks, and milestone achievements (7d, 30d, 100d, 365d)
- [ ] **FOCUS-01**: Rock-solid Focus Arena with persistent timers, break modes, session history, and overcharge multipliers
- [ ] **ECON-01**: Controlled economy ledger tracking Coins, Mana Gems, and Spire Shards with audit reasons
- [ ] **CHEST-01**: Timestamp-driven chest unlock system across all 4 deck slots with accurate countdowns
- [ ] **CITADEL-01**: Long-term base progression tied directly to productivity telemetry, power milestones, and visual unlocks
- [ ] **ACHV-01**: Real activity-driven achievements system
- [ ] **ANLY-01**: Productivity analytics dashboard with 7d / 30d / 90d telemetry trends and daily run summaries
- [ ] **ONBD-01**: Lightweight 30-second first-run tutorial modal with skip & completion state persistence
- [ ] **NOTF-01**: Non-intrusive local browser notification engine for session completions and streak warnings
- [ ] **QUAL-01**: Automated Vitest test suite covering all business logic engines
- [ ] **QUAL-02**: TypeScript strictness without `any` or `@ts-ignore`
- [ ] **CI-01**: GitHub Actions CI workflow (typecheck, lint, test, build)
- [ ] **DOCS-01**: Full README rewrite with architecture, loop diagrams, and dev instructions

### Out of Scope

- **User Accounts / Authentication**: No login, sign-up, passwords, OAuth, Clerk, Firebase, or Supabase Auth. AUCTUS is personal.
- **Multi-user / Social / Multiplayer**: No shared databases, permissions, friends lists, or guilds.
- **Mandatory Cloud Backend**: No servers or remote databases required for core gameplay.
- **Generic SaaS Redesign**: Visual identity must remain game-like, tactile, and immersive.

## Context

AUCTUS was previously developed as a rich prototype with impressive UI styling and sound design, but suffered from architectural bottlenecks (monolithic 600-line `GameStateContext`, `setInterval`-based timers prone to tab suspension, unversioned storage, and missing habit/analytics/testing systems). This upgrade transitions AUCTUS into an architectural masterpiece and genuinely reliable daily driver.

## Constraints

- **Local-First**: All data must reside on the client device in browser storage.
- **Zero Data Loss**: Existing progress (`auctus_*_v1`) must migrate cleanly without wiping user data.
- **Deterministic Logic**: Domain rules must be pure functions testable outside of React.
- **Zero-Dependency Styling**: Use existing Tailwind token system and vanilla CSS.
- **Timer Reliability**: Timers must be derived from timestamps (`Date.now()`).

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| No Authentication | Personal productivity application for 1 user; auth adds useless complexity. | ✓ Good |
| Timestamp-Based Timers | `setInterval` drifts on background tabs and resets on refresh. | ✓ Good |
| Pure Domain Game Engine | Separates business logic from React context for 100% testability. | ✓ Good |
| Schema-Versioned Storage | Protects user save states across application updates. | ✓ Good |
| Vitest Test Framework | Fast native ESM test runner with direct Vite integration. | ✓ Good |

---
*Last updated: 2026-09-06 after codebase onboarding*
