# Store

`src/store/` contains all data logic. No React here — pure TypeScript functions
that components import.

---

## Files

| File | Responsibility |
|---|---|
| `storage.ts` | Read/write `AppData` to localStorage |
| `helpers.ts` | Aggregation & formatting utilities |

---

## storage.ts

```ts
const STORAGE_KEY = 'wowAH';

function loadData(): AppData          // returns { items: [], entries: [] } if empty/corrupt
function saveData(data: AppData): void
function addItem(data: AppData, name: string): AppData
function deleteItem(data: AppData, name: string): AppData   // also removes all its entries
function addEntry(data: AppData, entry: PriceEntry): AppData
function deleteEntry(data: AppData, id: string): AppData
```

All mutators return a **new** `AppData` object (immutable pattern) and do NOT call
`saveData` themselves — the caller decides when to persist.

---

## helpers.ts

### formatGold(v: number | null): string
Returns `"150.50g"` or `"—"` for null.

### formatDate(iso: string): string
Returns `"Mon 21 Apr 14:30"`.

### uid(): string
Returns a unique string id (`Date.now().toString(36) + Math.random().toString(36).slice(2)`).

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

## State management

No Redux / Zustand. `App.tsx` owns a single `AppData` state via `useState`,
initialised from `loadData()`. Every mutation:
1. Calls the relevant pure helper to get a new `AppData`.
2. Calls `saveData(next)`.
3. Calls `setData(next)` to trigger re-render.

Components receive data and callback props — they do not touch localStorage directly.
