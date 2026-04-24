# MainPanel Components

`src/components/MainPanel/MainPanel.tsx` is the right-hand content area.

When no item is selected it shows an empty state. When an item is selected
it renders four sections stacked vertically with a gap between cards:

1. **HistoryChart** — line chart of all entries over time
2. **WeekdayChart** — bar chart of Mon–Sun averages
3. **WeekdayTable** — detailed Mon–Sun table
4. **EntryList** — raw log of recent entries

### Props
```ts
interface MainPanelProps {
  selectedItem: string | null;
  entries: PriceEntry[];        // all entries; panel filters to selectedItem
  onDeleteEntry: (id: string) => void;
}
```

---

## HistoryChart

Line chart showing both `minBuyout` (green) and `marketPrice` (blue) over time
for the selected item.

### Behaviour
- Entries sorted ascending by timestamp before charting.
- X-axis labels: `"Mon 21 Apr"` (short weekday + date, no time).
  When multiple entries land on the same date, all are shown individually
  — do not collapse/average them.
- Y-axis: gold values with `"g"` suffix on tick labels.
- `spanGaps: true` so a missing value doesn't break the line.
- Tooltip shows both values for the hovered point.
- If fewer than 2 entries exist, show a muted `"Not enough data to chart."`
  message instead of rendering the canvas.
- Chart colour scheme follows the theme (green = min buyout, blue = market price).

---

## WeekdayChart

Bar chart showing the **average** `minBuyout` and `marketPrice` per weekday (Mon–Sun).

### Behaviour
- Day order: Mon → Sun (WKORDER = [1,2,3,4,5,6,0]).
- Each day has two grouped bars: one green (min buyout avg), one blue (market price avg).
- Days with no data show `null` (bar absent, not zero).
- Y-axis same gold-suffix format as HistoryChart.
- Tooltip: shows the averaged gold value.
- If no entries exist at all, show muted `"No data yet."` message.

---

## WeekdayTable

Tabular breakdown of price statistics per weekday.

### Columns
| Column | Notes |
|---|---|
| Day | Full weekday name. Badges: gold "Today", blue "Tomorrow" inline. |
| Entries | Count of entries recorded on this weekday. |
| Min Buyout avg | Green. `"—"` if no data. |
| Min Buyout range | Muted. `"X – Y"` format. `"—"` if no data. |
| Market Price avg | Blue. `"—"` if no data. |
| Market Price range | Muted. `"X – Y"` format. `"—"` if no data. |

### Behaviour
- Today's row has a subtle gold-tinted background.
- Tomorrow's row has a subtle blue-tinted background.
- Both badges are shown simultaneously if today === tomorrow (won't happen,
  but safe to guard anyway).
- If no entries at all, show muted `"No data yet."` message instead of the table.

---

## EntryList

Scrollable list of the 60 most recent raw price entries for the selected item.

### Behaviour
- Sorted newest-first.
- Each row: `[date]  Min: Xg  Mkt: Yg  [delete button]`
- `"—"` for any null price field.
- Delete button calls `onDeleteEntry(id)` — no confirm dialog (recoverable
  via export; keeping it frictionless).
- Max-height container with overflow-y scroll (so it doesn't push the page).
- If no entries, show muted `"No entries yet."`.
