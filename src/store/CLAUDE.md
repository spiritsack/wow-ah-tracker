# Store

`src/store/` contains data persistence and aggregation logic. No React here —
pure TypeScript functions that components import.

Money formatting/conversion lives in `src/money.ts` (top-level), not here.

---

## Files

| File | Responsibility |
|---|---|
| `storage.ts` | Read/write `AppData` to localStorage; immutable mutators |
| `parseAppData.ts` | Validate raw JSON → `AppData` for boot + import |
| `time.ts` | Date/datetime-local formatting + weekday constants |
| `weekdayStats.ts` | `getWeekdayStats` aggregation |
| `id.ts` | `uid()` generator |

---

## storage.ts

```ts
const STORAGE_KEY = 'wowAH';

function loadData(): AppData          // returns { items: [], entries: [] } if empty/corrupt
function saveData(data: AppData): void
function addItem(data: AppData, name: string): AppData
function deleteItem(data: AppData, name: string): AppData   // also removes all its entries
function addEntry(data: AppData, entry: PriceEntry): AppData
function updateEntry(data: AppData, updated: PriceEntry): AppData
function deleteEntry(data: AppData, id: string): AppData
```

All mutators return a **new** `AppData` object (immutable pattern) and do NOT call
`saveData` themselves — the caller decides when to persist.

---

## parseAppData.ts

```ts
type ParseResult =
  | { ok: true; data: AppData }
  | { ok: false; reason: string };

function parseAppData(raw: string): ParseResult
```

Single validator shared by `loadData()` (corrupt → empty) and the import
button (corrupt → alert with reason). Top-level shape check only — does
not validate individual `PriceEntry` fields.

---

## time.ts

### formatDate(iso: string): string
Returns `"Mon 21.04.2026 14:30"` (English short weekday + Norwegian DD.MM.YYYY HH:MM).

### isoToDatetimeLocal(iso: string): string
Converts an ISO timestamp to the `<input type="datetime-local">` format.

### nowDatetimeLocal(): string
Convenience: current time in datetime-local format.

### Constants
- `WKORDER = [1,2,3,4,5,6,0]` — Mon-first display order over JS day-of-week.
- `DAY_FULL`, `DAY_SHORT` — weekday names indexed by JS day-of-week.

---

## weekdayStats.ts

### getWeekdayStats(entries: PriceEntry[]): WeekdayStats

```ts
interface DayStat {
  count: number;
  minBuyout:   { avg: number | null; lo: number | null; hi: number | null };
  marketPrice: { avg: number | null; lo: number | null; hi: number | null };
}

// Keyed 0–6 (JS day-of-week: 0=Sunday … 6=Saturday)
type WeekdayStats = Record<number, DayStat>;
```

Computes per-weekday average, min, and max separately for `minBuyout` and
`marketPrice`. Ignores null values (only counts entries where the field was
actually recorded).

---

## id.ts

### uid(): string
Returns a unique string id (`Date.now().toString(36) + Math.random().toString(36).slice(2)`).

---

## State management

No Redux / Zustand. `App.tsx` owns a single `AppData` state via `useState`,
initialised from `loadData()`. Every mutation:
1. Calls the relevant pure helper to get a new `AppData`.
2. Calls `saveData(next)`.
3. Calls `setData(next)` to trigger re-render.

Components receive data and callback props — they do not touch localStorage directly.
