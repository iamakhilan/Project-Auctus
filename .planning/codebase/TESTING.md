# Testing Strategy & Structure

**Analysis Date:** 2026-09-06

## Current Testing State

- **Framework:** None currently installed in `package.json`.
- **Test Files:** No unit, integration, or E2E test files exist in the repository.
- **Coverage:** 0%.
- **Validation:** Type checking (`tsc`) and Vite production build (`npm run build`) are currently the only automated gates.

## Recommended Testing Architecture

To turn AUCTUS into a reliable production-quality application, a dedicated test framework is required:

### 1. Test Framework
- **Vitest:** Fast, native ESM & TypeScript test runner directly compatible with Vite (`vite.config.ts`).
- **React Testing Library & jsdom:** Component interaction and accessibility testing.

### 2. Priority Business Logic Test Targets

1. **Progression Engine:**
   - XP calculations across quest tiers.
   - Level progression curve and overflow logic (`newXp >= newXpTarget`).
   - Citadel power accumulation and tier unlocking.
2. **Quest Engine:**
   - Quest completion status transitions.
   - Reward yield attribution (XP, Coins, Streak Shields).
   - Empty loot deck chest drop generation.
3. **Time-Based Systems & Focus Arena:**
   - Timestamp-derived remaining time calculations (`endsAt - now`).
   - Session duration, pause, resume, overcharge multiplier bonuses.
   - Recovery of running timers across browser reload/sleep.
4. **Economy & Treasury Transactions:**
   - Currency balance mutations (`addCoins`, `spendCoins`, `addShards`).
   - Insufficient balance rejections.
   - Reward redemption and custom reward creation.
5. **Chest Deck Engine:**
   - Unlock state progression (`queued` -> `unlocking` -> `ready` -> `empty`).
   - Timestamp-based chest countdown accuracy.
   - Loot claiming and inventory slot resetting.
6. **Persistence & Schema Migrations:**
   - Safe parsing and recovery from corrupted `localStorage`.
   - Schema versioning and automated data migration (`v1` -> `v2`).
   - JSON export and import verification.

## Test Directory Structure (Planned)

```text
tests/
├── unit/
│   ├── progression.test.ts
│   ├── quests.test.ts
│   ├── economy.test.ts
│   ├── focus.test.ts
│   ├── chests.test.ts
│   └── persistence.test.ts
└── integration/
    ├── quest-to-reward-flow.test.ts
    └── timer-recovery.test.ts
```

---

*Testing analysis: 2026-09-06*
*Update after test framework implementation*
