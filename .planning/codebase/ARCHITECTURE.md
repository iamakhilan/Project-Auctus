# System Architecture

**Analysis Date:** 2026-09-06

## Architectural Pattern

AUCTUS is currently built as a **Single Page React Application (SPA)** organized with a **monolithic Context-driven state model**.

```
┌─────────────────────────────────────────────────────────────┐
│                       React UI View Layer                   │
│                                                             │
│  [HeaderHUD] ── [BottomDockNav] ── [RewardModal]           │
│  ├── RealmView        (Sanctuary, Loot Deck, Quick Focus)   │
│  ├── QuestsView       (Mission Forge, Bounty Deck, Habits)  │
│  ├── FocusArenaView   (Crucible Timer, Overcharge, Audio)   │
│  ├── VaultView        (Bazaar, Chest Gallery, Currencies)   │
│  └── CitadelView      (Telemetry, Rank, Base Progression)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ useGameState()
┌──────────────────────────────▼──────────────────────────────┐
│                  GameStateContext.tsx (Context)             │
│                                                             │
│  State slices:                                              │
│  - profile (PlayerProfile)                                  │
│  - quests (Quest[])                                         │
│  - chests (ChestSlot[4])                                    │
│  - rewards (RewardItem[])                                   │
│  - focusSession (FocusSessionState)                         │
│  - claimModal (ClaimModalData)                              │
│                                                             │
│  Timers:                                                    │
│  - setInterval for focus session decrement                  │
│  - setInterval for chest unlock countdown                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
   ┌─────────────────────────┐   ┌──────────────────────────┐
   │    storage.ts (I/O)     │   │ audioSynthesizer.ts      │
   │ localStorage persistence│   │ Web Audio Synth Engine   │
   └─────────────────────────┘   └──────────────────────────┘
```

## Layers & Module Boundaries

### 1. Presentation Layer (`src/components/`)
- `layout/`:
  - `HeaderHUD.tsx`: Fixed top bar showing player avatar, level badge, XP bar, currencies (gems, coins, streak), sound toggle, screen titles.
  - `BottomDockNav.tsx`: Fixed bottom bar with 5 primary navigation tabs (Realm, Quests, Focus Arena Center CTA, Vault, Citadel) and real-time badge counts.
- `realm/`:
  - `RealmView.tsx`: Main dashboard combining daily loot progress, crown vault segment meter, central floating 3D island, primary "START FOCUS" action, and the 4-slot mission loot chest deck.
- `quests/`:
  - `QuestsView.tsx`: Daily clearance progress, tabbed bounty filters (bounties, epic, habits), mission list with status stamps, and the sticky "Mission Forge" quest creator.
- `focus/`:
  - `FocusArenaView.tsx`: Crucible circular holographic timer, telemetry chips, ambient soundscape dropdown, tactical pause/yield/overcharge controls.
- `vault/`:
  - `VaultView.tsx`: Treasury balances, loot chest gallery (unlocked, time-locked, milestone cases), reward bazaar with real-world/Citadel perk redemption and custom reward creation.
- `citadel/`:
  - `CitadelView.tsx`: Commander profile summary, productivity telemetry (deep work hours, consistency streak, quests conquered, chests claimed), recent victory archives, and settings.
- `common/`:
  - `RewardModal.tsx`: Celebratory victory modal triggered on chest claim, quest completion, focus triumph, or reward redemption.

### 2. State & Business Logic Layer (`src/context/GameStateContext.tsx`)
- Currently holds all state and game rules:
  - XP progression formula: `newXpTarget = Math.round(newXpTarget * 1.3)` on level up
  - Currency mutations: `addCoins`, `addShards`
  - Quest lifecycle: `createQuest`, `completeQuest`
  - Chest lifecycle: `unlockChest`, `claimChestLoot`
  - Reward purchasing: `redeemReward`, `createCustomReward`
  - Focus session lifecycle: `startFocusSession`, `pauseFocusSession`, `resumeFocusSession`, `cancelFocusSession`, `completeFocusSession`, `toggleManaOvercharge`
  - Timer intervals: 1-second interval effects for focus countdown and chest unlocking.

### 3. Utility & Infrastructure Layer (`src/utils/`)
- `storage.ts`: Initial seed data constants and localStorage get/set helpers.
- `audioSynthesizer.ts`: `SoundEngine` class utilizing the Web Audio API for tactical clicks, victory fanfares, coin chimes, level-up chords, overcharge bursts, and ambient soundscapes.

## Data Flow

1. **User Action:** User taps a button in a view component (e.g., "Forge Quest" or "Claim Chest").
2. **Context Method Call:** The component dispatches a method on `useGameState()`.
3. **State Mutation:** React `useState` updater computes new state in memory.
4. **Side Effects:**
   - `soundEngine.play*()` generates procedural audio.
   - `confetti()` triggers particle animations.
   - `useEffect` hooks serialize modified state to `localStorage`.
5. **Re-render:** Subscribed components re-render with updated values.

## Architectural Bottlenecks Identified

1. **State Monolith in `GameStateContext.tsx`:**
   - All state slices (profile, quests, chests, rewards, focus timer, modals) are clustered in one 600-line context.
   - Any timer tick (every second) causes potential re-render cascades across components consuming the context.
2. **Interval-Based Timer Source of Truth:**
   - Focus session and chest unlock timers rely on `remainingSeconds - 1` inside `setInterval()`.
   - If tab is backgrounded, browser sleeps, or user refreshes page, timers freeze or reset.
3. **Mixed Business Logic and UI Context:**
   - Game rules (XP calculation, coin yields, drop rates, streak validation) are hardcoded inside React callback closures rather than testable pure domain modules.
4. **Flat Storage Schema without Migrations:**
   - Storage uses 4 disparate keys (`auctus_*_v1`) without schema versioning, validator guards, or safe migration pipelines.

---

*Architecture analysis: 2026-09-06*
*Update after structural refactoring*
