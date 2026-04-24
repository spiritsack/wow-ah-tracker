# WoW TBC Anniversary — AH Price Tracker

A single-page React/TypeScript app for logging and analysing World of Warcraft TBC
Anniversary Auction House prices. No backend — all data lives in `localStorage`.

---

## Stack

| Tool | Purpose |
|---|---|
| Vite | Dev server & build |
| React 18 | UI |
| TypeScript | Types |
| Chart.js + react-chartjs-2 | Charts |
| Plain CSS (index.css) | Global styles / theme |

## Dev commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

---

## Core data types

```ts
// A single tracked item (just a name — entries reference it by string)
type ItemName = string;

// One price snapshot logged by the user
interface PriceEntry {
  id: string;           // uid (Date.now base-36 + random)
  item: ItemName;
  minBuyout: number | null;    // gold (decimal). null = not recorded this snapshot
  marketPrice: number | null;  // gold (decimal). null = not recorded this snapshot
  timestamp: string;           // ISO 8601
}

// Root storage shape written to localStorage key "wowAH"
interface AppData {
  items: ItemName[];
  entries: PriceEntry[];
}
```

Prices are stored as plain decimal gold values (e.g. `150.50` = 150g 50s).
No silver/copper split in the data model — the input fields accept decimal gold.

---

## Theme / visual style

Dark WoW-inspired palette. Variables defined in `index.css`:

```css
--bg-dark    : #0d0d1a   /* page background */
--bg-card    : #161624   /* card / panel background */
--bg-input   : #0f0f1e   /* input background */
--gold       : #c8a84b
--gold-light : #f0d080
--gold-dark  : #7a5c10
--text       : #d4b896
--text-muted : #7a6a5a
--border     : #2e2820
--green      : #44cc88   /* min buyout colour */
--blue       : #5599dd   /* market price colour */
--red        : #cc4444
```

No UI library (no MUI, Chakra, etc.). Hand-written CSS only.
No emojis in UI text.

---

## Layout

```
┌── header ──────────────────────────────────────────┐
│ "WoW TBC Anniversary — AH Price Tracker"            │
├── sidebar (300 px fixed) ──┬── main (flex 1) ──────┤
│  ItemList                  │  (empty state OR)      │
│  LogForm                   │  HistoryChart          │
│  BackupPanel               │  WeekdayChart          │
│                            │  WeekdayTable          │
│                            │  EntryList             │
└────────────────────────────┴────────────────────────┘
```

Sidebar is a fixed-width column. Main panel fills the rest. Both scroll
independently. No mobile breakpoint needed for now.

---

## Conventions

- All components are function components with named exports.
- Props interfaces are defined in the same file as the component.
- No `any`. Use `unknown` + type narrowing at the localStorage boundary only.
- Gold values formatted as `"150.50g"` throughout the UI.
- Dates displayed as `"Mon 21.04.2026 14:30"` (English short weekday + Norwegian DD.MM.YYYY HH:MM).
- Day-of-week order in all weekday views: Mon → Sun.
