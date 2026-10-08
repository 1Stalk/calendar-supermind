# 📅 Calendar Supermind (DateCountingWeb)

A fast, mobile-first web trainer for mental calendar calculations — compute the day of the week for any Gregorian date in seconds without a calculator.

Built with **Astro**, **TypeScript**, and **Vanilla CSS**.

---

## ⚡ Features

- **Grand Simulator**: 4 difficulty presets (Current Decade, Modern Era, Full History 1600–2399, Leap Trap Focus), live timer, diagnostic feedback, and step-by-step pipeline breakdown.
- **5 Progressive Drills**:
  1. *Days & Digits* (1 = Mon … 0 = Sun)
  2. *Modulo 7* (Remainder via anchor Sundays)
  3. *Month Mnemonics* (Card mnemonics & blitz quiz)
  4. *Year & Leap* (28-year anchor cycle & fast leap test)
  5. *Century Codes* (Reverse countdown: 6, 4, 2, 0)
- **Audio & Haptics**: Synthesized sound effects via Web Audio API and device vibrations.
- **Reference Modal**: Quick formula and mnemonic cheat sheet.
- **Bilingual**: Full Russian and English localization.

---

## 📁 Project Structure

```
DateCountingWeb/
├── .github/workflows/
│   └── deploy.yml              # Automated GitHub Pages CI/CD
├── public/
│   ├── favicon.svg             # App icon
│   └── manifest.webmanifest    # PWA install configuration
├── src/
│   ├── components/             # Reusable Astro UI components
│   │   ├── tabs/               # Mode views
│   │   │   ├── Level1Tab.astro # Drill 1: Days & digits
│   │   │   ├── Level2Tab.astro # Drill 2: Modulo 7 reset
│   │   │   ├── Level3Tab.astro # Drill 3: Month mnemonics
│   │   │   ├── Level4Tab.astro # Drill 4: Year code & leap test
│   │   │   ├── Level5Tab.astro # Drill 5: Century codes
│   │   │   └── SimulatorTab.astro # Main Grand Simulator
│   │   ├── CheatSheetModal.astro  # Reference modal dialog
│   │   ├── Header.astro           # App bar (language, cheat sheet, sound)
│   │   ├── StatsBar.astro         # Top metrics (streak, record, speed)
│   │   └── TabNavigation.astro    # Navigation tabs
│   ├── layouts/
│   │   └── Layout.astro        # HTML shell and metadata
│   ├── lib/                    # Core business logic & services
│   │   ├── i18n/               # Modular internationalization
│   │   │   ├── locales/
│   │   │   │   ├── en.ts       # English dictionary
│   │   │   │   └── ru.ts       # Russian dictionary
│   │   │   ├── format.ts       # Template interpolation helper
│   │   │   ├── types.ts        # Localization types
│   │   │   └── index.ts        # i18n manager & date formatting
│   │   ├── audio.ts            # Web Audio synthesizer & haptics
│   │   ├── calendar-core.ts    # Pure mathematical date calculation engine
│   │   ├── i18n.ts             # Backward-compatible i18n entry point
│   │   └── storage.ts          # Safe LocalStorage persistence
│   ├── pages/
│   │   └── index.astro         # Single-page application entry point
│   ├── scripts/                # Modular client-side controllers
│   │   ├── common/
│   │   │   ├── base-drill.ts   # Base drill class (safe timers & state)
│   │   │   └── dom-utils.ts    # Type-safe DOM lookup helpers
│   │   ├── controllers/
│   │   │   ├── drills/         # Individual drill controllers (L1..L5)
│   │   │   ├── cheat-sheet.ts  # Cheat sheet modal controller
│   │   │   ├── hints.ts        # Collapsible hint helper
│   │   │   ├── navigation.ts   # Tab navigation controller
│   │   │   ├── simulator.ts    # Simulator & keyboard handlers
│   │   │   └── stats.ts        # Live stats UI controller
│   │   └── app-controller.ts   # Client orchestrator & bootstrap
│   └── styles/
│       └── global.css          # Design system & dark mode tokens
├── astro.config.mjs            # Astro configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) (Static Site Generation)
- **Language**: TypeScript (Strict mode)
- **Styling**: Vanilla CSS (Custom tokens, zero framework bloat)
- **Audio**: Web Audio API (Synthesized in-browser, no audio files)
- **Storage**: `localStorage` (Safe fallback for private browsing)
