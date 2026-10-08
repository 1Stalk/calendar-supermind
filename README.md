# 📅 Calendar Supermind (DateCountingWeb)

An interactive, mobile-first web trainer designed to build lightning-fast mental calendar calculation skills — determining the day of the week for any historical or future date in seconds without calculator or complex arithmetic.

Built with **Astro**, Vanilla CSS, and TypeScript. Styled with a clean, distraction-free minimalist aesthetic tailored for smartphone screens and desktop browsers alike.

---

## ⚡ Key Features

- **⚡ Grand Simulator (Main Mode)**:
  - 4 difficulty presets: *Current Decade (2020–2029)*, *Modern Era (1900–2099)*, *Full History (1600–2399)*, and *4% Leap Trap Focus (Jan/Feb)*.
  - Millisecond-accurate live speed timer and record tracker.
  - Intelligent error diagnostics (detects leap year Jan/Feb trap vs calculation slip).
  - Step-by-step computational pipeline breakdown (Day Mod 7 $\to$ Month Code $\to$ Century Code $\to$ Year Code $\to$ Final Weekday).
  - Ergonomic **3-3-1 keypad** layout (`1..3`, `4..6`, `0 Sunday`) optimized for single-thumb mobile tapping.
- **5 Progressive Mastery Drills**:
  - **Level 1 (Days & Digits)**: Instant reflex matching Monday = 1 through Sunday = 0.
  - **Level 2 (Modulo 7 Reset)**: Fast remainder calculation using anchor Sundays (7, 14, 21, 28).
  - **Level 3 (Month Mnemonics)**: Compact 2-column mnemonic association cards + blitz quiz with leap-month toggles.
  - **Level 4 (Year & Leap Test)**: Year code calculation via 28-year anchor cycle (28, 56, 84) + 0.5-second leap year test.
  - **Level 5 (Century Codes)**: Century reverse countdown drill (6, 4, 2, 0).
- **Audio & Haptics**:
  - Built-in Web Audio API sound synthesizer (success chime, record fanfare, error tone, tap click) with mute toggle — no external audio files required.
  - Haptic vibration feedback on supported mobile devices (`navigator.vibrate`).
- **📖 Instant Cheat Sheet**:
  - Slide-over quick reference modal with formula, day mappings, mnemonics, and leap rules.
- **Mobile-First & PWA Ready**:
  - Perfectly adapts to any smartphone viewport (iPhone, Android) and centers cleanly on desktop.
  - Includes a web app manifest for full-screen "Add to Home Screen" installation.

---

## 🚀 Quick Start (Local Development)

1. Install dependencies:
```bash
npm install
```

2. Start the local development server:
```bash
npm run dev
```

Open `http://localhost:4321` in your browser.

To access the app from your smartphone over your local Wi-Fi network:
```bash
npm run dev -- --host
```

---

## 📦 Zero-Config Deployment to GitHub Pages

The repository includes a pre-configured GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) for automated static deployment:

1. Create a new GitHub repository and push your code:
```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

2. On GitHub, navigate to **Settings** $\to$ **Pages**.
3. Under **Build and deployment** $\to$ **Source**, select **GitHub Actions**.
4. GitHub will automatically run the build workflow and publish your live web app link accessible on both mobile and desktop!

---

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) (Static Site Generation)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Custom Design System, Dark Mode, Zero Framework Bloat)
- **Audio**: Web Audio API (Synthesized in-browser)
- **Storage**: `localStorage` (Tracks streaks, total solved, and personal speed records)
