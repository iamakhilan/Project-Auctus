# Coding Conventions & Code Style

**Analysis Date:** 2026-09-06

## TypeScript & Type Safety Patterns

- **Strict Type Checking:** `strict: true` in `tsconfig.json`.
- **Import Extensions:** `allowImportingTsExtensions: true` is configured in `tsconfig.json`.
- **Type Definitions:** Centralized in `src/types/index.ts`.
- **Discriminated Unions / Literal Types:**
  - `TabType = 'realm' | 'quests' | 'focus-arena' | 'vault' | 'citadel'`
  - `QuestTier = 'Tier I' | 'Tier II' | 'Tier III' | 'Epic' | 'Urgent' | 'Rare' | 'Common'`
  - `QuestCategory = 'bounty' | 'epic' | 'habit'`
  - `ChestStatus = 'unlocking' | 'queued' | 'ready' | 'empty' | 'locked'`
  - `RewardItem.type = 'irl' | 'game'`

## React Patterns

- **Functional Components:** All components are authored as functional components with `React.FC` or typed props.
- **Custom Hook Accessor:** `useGameState()` provides typed access with an invariant check:
  ```typescript
  export const useGameState = () => {
    const context = useContext(GameStateContext);
    if (!context) {
      throw new Error('useGameState must be used within a GameStateProvider');
    }
    return context;
  };
  ```
- **State Updates:** Functional state updates (`setProfile(prev => ({ ...prev, ... }))`) are standard practice to prevent stale closures.
- **Callback Memoization:** `useCallback` wraps all context action handlers (`addXp`, `addCoins`, `completeQuest`, etc.).

## Visual & UI Design Conventions

- **Design Aesthetic:** Dark Navy HUD (`#081326`) with gold (`#fbbf24`), cyan (`#38bdf8`), emerald (`#00e59b`), and ruby (`#f43f5e`) accents.
- **3D Beveled Buttons:**
  - `.btn-gold`: Gold gradient with bottom shadow and active translate depression (`transform: translateY(3px)`).
  - `.btn-navy`: Navy high gradient for secondary actions.
  - `.btn-emerald`: Emerald gradient for claim/redeem confirmations.
  - `.btn-ruby`: Crimson/ruby for destructive or surrender actions.
  - `.btn-cyan`: Cyan aura for tech/overcharge actions.
- **Card Grammar:** Inset well backgrounds (`bg-surface-dim shadow-inset-well`) or raised gradient cards (`shadow-card-raised`).
- **Icons:** Material Symbols Outlined rendered via Google Fonts `<span className="material-symbols-outlined">icon_name</span>`.
- **Reduced Motion Support:** `@media (prefers-reduced-motion: reduce)` rules disable floating, pulsing, and bouncing animations in `index.css`.

## Error Handling & Defensive Coding

- **Storage I/O:** `try / catch` blocks in `src/utils/storage.ts` wrap JSON parse and stringify operations with fallback defaults.
- **Audio Autoplay Safety:** `try / catch` blocks in `src/utils/audioSynthesizer.ts` prevent unhandled exceptions if the browser restricts audio autoplay before user gesture.

---

*Conventions analysis: 2026-09-06*
*Update after style or linting changes*
