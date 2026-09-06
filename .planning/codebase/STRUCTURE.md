# Directory Structure & Organization

**Analysis Date:** 2026-09-06

## Directory Layout

```text
Project-Auctus/
├── .agents/                 # GSD Core development runtime configuration & skills
├── .planning/               # GSD project plans, codebase map, requirements, roadmap
│   └── codebase/            # Codebase mapping documentation (7 documents)
├── dist/                    # Compiled production assets from Vite build
├── public/                  # Static assets and game artwork
│   └── assets/              # Avatar, crest, island, crowns, and chest textures
├── src/
│   ├── components/          # React presentation layer grouped by domain
│   │   ├── citadel/         # Citadel progression & player profile telemetry
│   │   │   └── CitadelView.tsx
│   │   ├── common/          # Shared modal & dialog components
│   │   │   └── RewardModal.tsx
│   │   ├── focus/           # Focus Arena crucible & timer view
│   │   │   └── FocusArenaView.tsx
│   │   ├── layout/          # Global shell components
│   │   │   ├── BottomDockNav.tsx
│   │   │   └── HeaderHUD.tsx
│   │   ├── quests/          # Mission forge & quest deck view
│   │   │   └── QuestsView.tsx
│   │   ├── realm/           # Primary dashboard & floating island view
│   │   │   └── RealmView.tsx
│   │   └── vault/           # Loot gallery & reward bazaar view
│   │       └── VaultView.tsx
│   ├── context/             # Global application state provider
│   │   └── GameStateContext.tsx
│   ├── types/               # TypeScript domain interfaces & type aliases
│   │   └── index.ts
│   ├── utils/               # Storage I/O and procedural audio engine
│   │   ├── audioSynthesizer.ts
│   │   └── storage.ts
│   ├── App.tsx              # Root shell orchestrator & tab router
│   ├── index.css            # Tailwind layers, button 3D state grammar, theme vars
│   └── main.tsx             # React entry point mounting to DOM (#root)
├── index.html               # HTML entry shell with Google Fonts & Material Symbols
├── package.json             # NPM dependencies, scripts, metadata
├── package-lock.json        # Pinned dependency lockfile
├── postcss.config.js        # PostCSS build config
├── tailwind.config.js       # Custom palette (gold, navy, emerald, ruby, cyan) & typography
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite build and dev server configuration
```

## Key File Locations

| File Path | Role & Responsibilities |
|---|---|
| `src/main.tsx` | Application entry point; mounts `<App />` to `#root`. |
| `src/App.tsx` | Main shell container; renders `HeaderHUD`, active tab view, `BottomDockNav`, and `RewardModal`. |
| `src/context/GameStateContext.tsx` | Central state management, game action handlers, and active intervals. |
| `src/types/index.ts` | Type definitions for `Quest`, `PlayerProfile`, `ChestSlot`, `RewardItem`, `FocusSessionState`, `ClaimModalData`, `TabType`. |
| `src/utils/storage.ts` | LocalStorage I/O helper functions and seed initial data. |
| `src/utils/audioSynthesizer.ts` | Web Audio synthesizer class (`SoundEngine`) providing SFX and ambient soundscapes. |
| `src/index.css` | 3D beveled button grammar, glow pulses, animations, and typography styles. |
| `tailwind.config.js` | Tailored color scheme (surface ladder, primary gold, secondary cyan, tertiary emerald). |

## Naming & Organization Conventions

- **Component Files:** PascalCase (e.g., `HeaderHUD.tsx`, `QuestsView.tsx`, `FocusArenaView.tsx`).
- **Utility / Service Files:** camelCase (e.g., `audioSynthesizer.ts`, `storage.ts`).
- **Directories:** lowercase kebab-case (e.g., `citadel`, `common`, `focus`, `layout`, `quests`, `realm`, `vault`).
- **Types / Interfaces:** PascalCase (e.g., `Quest`, `PlayerProfile`, `ChestSlot`).

---

*Structure analysis: 2026-09-06*
*Update after directory reorganizations*
