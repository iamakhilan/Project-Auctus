# Duolingo Design System ? Style Guide

A comprehensive, pixel-perfect visual reference for the Duolingo design system covering colors, typography, tactile 3D button variants, cards, and interactive UI components.

## Features

- **Fonts**:
  - Primary: `Nunito` (Google Fonts, weights 400?900)
  - Display / Heading: `Feather Bold` (OnlineWebFonts)
  - Fallback: `Nunito`, `DIN Round Pro`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Color Tokens**:
  - `--green`: `rgb(88, 204, 2)` / `#58CC02`
  - `--green-hover`: `rgb(75, 178, 0)` / `#4BB200`
  - `--green-shadow`: `#61B800`
  - `--dark-blue`: `rgb(16, 15, 62)` / `#100F3E`
  - `--blue`: `rgb(28, 176, 246)` / `#1CB0F6`
  - `--gray-text`: `rgb(75, 75, 75)` / `#4B4B4B`
  - `--gray-light`: `rgb(119, 119, 119)` / `#777777`
  - `--border-color`: `rgb(229, 229, 229)` / `#E5E5E5`
  - `--nav-text`: `rgb(175, 175, 175)` / `#AFAFAF`
  - `--footer-green`: `#4EC604`
  - `--red`: `#FF4B4B`
  - `--orange`: `#FF9600`
  - `--golden`: `#FFC800`
- **8 Comprehensive Panels**:
  1. Color Palette (Light) ? 12 Swatches with hex copy
  2. Typography (Light) ? Display, Headings, Body, Captions, Hints
  3. Button Variants (Light) ? 3D Primary, Secondary, Danger, Ghost, Disabled & Small variants
  4. Dark Theme Buttons ? High-contrast dark blue surface buttons
  5. Cards (Light) ? Spanish & French course cards with tags and units
  6. Dark Theme Cards ? Super & Pro subscription cards
  7. UI Components (Light) ? Badges, Input+Action, Toggles, Progress Bars, Tooltips & Streak Counter
  8. Dark Theme Components ? Active Language Pills, Active Community Avatar Stack, Dark Progress & Medals

## Development

```bash
npm install
npm run dev
```
