# Technical Debt, Risks & Concerns

**Analysis Date:** 2026-09-06

## 1. Time-Based Systems Relying on `setInterval()` (Critical Risk)

### Issue:
In `src/context/GameStateContext.tsx`, both the Focus Arena timer (lines 516–533) and the Chest Unlock countdowns (lines 536–561) use `setInterval(() => { setRemaining(s => s - 1) }, 1000)`.

### Consequences:
1. **Background Tab Throttling:** Modern browsers throttle background tab timers to 1-minute intervals or completely suspend them. A 25-minute focus session or 1-hour chest unlock can take hours in backgrounded tabs.
2. **Tab Sleep / Hibernate / Refresh Drift:** Refreshing the page or closing the laptop resets running sessions or produces inaccurate countdown calculations.
3. **Desynchronization:** Timers drift away from real wall-clock time over long periods.

### Remedy:
Replace interval decrements with **timestamp-anchored state**:
```typescript
interface FocusSession {
  startedAt: number; // Date.now()
  endsAt: number;    // Date.now() + durationMs
  pausedAt?: number;
  remainingDuration: number;
}
```
Calculate `remaining = Math.max(0, endsAt - Date.now())` dynamically at render time. Use intervals strictly for UI re-render ticks.

---

## 2. Monolithic Context State Bloat in `GameStateContext.tsx` (Architecture Debt)

### Issue:
`GameStateContext.tsx` currently spans over 600 lines and combines all state slices (profile, quests, chests, rewards, focus session, claim modal, sound settings).

### Consequences:
1. Every 1-second timer tick triggers state updates in `GameStateProvider`, triggering re-evaluations across all consumers of `useGameState()`.
2. High coupling between unrelated subsystems (e.g. quest creation logic interacting directly with chest slot mutation).
3. Difficult to unit test game logic independently without mocking React hooks and context.

### Remedy:
Extract domain logic into pure TypeScript modules (e.g. `domain/progression`, `domain/quests`, `domain/economy`, `domain/focus`, `domain/chests`) and separate state into focused hooks or modular sub-contexts.

---

## 3. Unversioned LocalStorage Schema & No Migration Strategy (Data Loss Risk)

### Issue:
Data is persisted in four unversioned keys (`auctus_profile_v1`, `auctus_quests_v1`, etc.) via direct `JSON.stringify` with no schema versioning, validation schemas, or migration path.

### Consequences:
1. If the TypeScript interfaces change (e.g., adding habits, modifying chest models, changing quest categories), existing user stored state can cause undefined property errors or crash the app on load.
2. No export/import mechanism to backup personal progress.

### Remedy:
Implement a schema-versioned local storage engine with automated migration pipelines (`v1 -> v2`) and JSON export/import utilities.

---

## 4. Habit Engine & Real Daily History Missing (Feature Gap)

### Issue:
Habits are currently represented only as a quest category tag (`category: 'habit'`) without daily frequency rules, habit completion history, dedicated streak tracking per habit, or milestone rewards.

### Remedy:
Implement a formal Habit engine with daily check-offs, individual streak tracking, milestone multipliers (7d, 30d, 100d), and Citadel integration.

---

## 5. Economy Ledger & Audit Missing (Balance Integrity Risk)

### Issue:
Currencies (Coins, Mana Gems, Spire Shards) are mutated directly in various UI handlers without transaction records.

### Remedy:
Implement an auditable transaction ledger (`domain/economy`) with explicit reasons (`quest_completion`, `chest_opened`, `bazaar_purchase`) and balance integrity guards.

---

## 6. Zero Automated Test Coverage (Quality Risk)

### Issue:
No test framework (Vitest, Jest) exists in the repository.

### Remedy:
Install Vitest and React Testing Library; write comprehensive unit tests for all domain calculation engines.

---

*Concerns analysis: 2026-09-06*
*Update after issues are resolved*
