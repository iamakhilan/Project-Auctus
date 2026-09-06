# External Integrations

**Analysis Date:** 2026-09-06

## Integration Architecture

AUCTUS is designed as a **strictly local-first, zero-backend personal application**. It does not call any third-party SaaS APIs, authentication endpoints, cloud databases, or remote telemetry backends in its core operational loop.

## Authentication & User Management

- **Status:** NONE by intentional design.
- **Decision:** No auth providers (Clerk, Supabase Auth, Firebase, Auth0, OAuth, Cognito).
- **Identity Model:** Single personal user represented as "Commander" in local state.

## Databases & Persistence

- **Primary Store:** Browser `localStorage` (`src/utils/storage.ts`)
  - `auctus_profile_v1` — Player stats, level, XP, currencies, streak, Citadel power
  - `auctus_quests_v1` — Active and completed quests/bounties
  - `auctus_chests_v1` — 4-slot chest loot deck with unlock timers
  - `auctus_rewards_v1` — Real-world & in-game reward catalog
- **Cloud Database:** None currently connected.
- **Future Hook Point:** Data export/import service can serialize all keys to JSON or connect to personal backup targets if requested in future milestones.

## Browser Web APIs

- **Web Audio API:** `window.AudioContext` / `webkitAudioContext` (`src/utils/audioSynthesizer.ts`)
  - Procedural sound generation (chimes, clicks, fanfares, level ups)
  - Synthetic ambient sound generator (binaural 432Hz sine osc, rain pink noise buffer, lowpass biquad filter)
- **Local Storage API:** Synchronous JSON storage for all game systems
- **Future Browser APIs:**
  - Web Notifications API for background focus alarms / streak reminders
  - BroadcastChannel / ServiceWorker for background timer alignment

## External Web Assets & CDNs

- **Fonts & Symbols:**
  - Google Fonts (`Plus Jakarta Sans`, `Rubik`) loaded via `<link>` in `index.html`
  - Google Material Symbols Outlined loaded via `<link>` in `index.html`
- **Asset Images:**
  - Local static assets in `public/assets/` (`crest.png`, `avatar.png`, `island.png`, `crown.png`, `chest_*.png`)

## Webhooks & Outbound Communication

- **Status:** None. AUCTUS operates with complete network isolation and data privacy.

---

*Integrations analysis: 2026-09-06*
*Update after integration changes*
