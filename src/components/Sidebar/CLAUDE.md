# Sidebar Components

The sidebar is a 300 px fixed-width column containing three stacked cards:
ItemList, LogForm, and BackupPanel.

`src/components/Sidebar/Sidebar.tsx` composes all three. It receives the full
`AppData` and callbacks from `App.tsx`.

---

## ItemList

### Purpose
Display all tracked items. Click to select. Add new ones. Delete existing ones.

### Props
```ts
interface ItemListProps {
  items: string[];
  entries: PriceEntry[];      // used to show entry count per item
  selectedItem: string | null;
  onSelect: (name: string) => void;
  onAdd: (name: string) => void;
  onDelete: (name: string) => void;
}
```

### Behaviour
- Text input + "Add" button at the top. Pressing Enter also adds.
- If the item already exists, selecting it (not duplicating) is fine.
- Each item row shows: item name | entry count badge | delete button.
- Clicking the row (not the delete button) calls `onSelect`.
- Delete button shows a `confirm()` dialog before calling `onDelete`.
- Active item row is highlighted with the gold border/background style.
- Empty state: `"No items yet."` muted text.

---

## LogForm

### Purpose
Log a new price snapshot for a selected item.

### Props
```ts
interface LogFormProps {
  items: string[];
  selectedItem: string | null;
  onLog: (entry: Omit<PriceEntry, 'id'>) => void;
}
```

### Fields
| Field | Input type | Notes |
|---|---|---|
| Item | `<select>` | Pre-selects `selectedItem`; changing it also updates global selection |
| Min Buyout | `number` (step 0.01) | Suffix label "g". Optional — may be left blank. |
| Market Price | `number` (step 0.01) | Suffix label "g". Optional — may be left blank. |
| Date & Time | `datetime-local` | Defaults to current time on mount (seconds zeroed). |

### Validation
- Must have an item selected.
- At least one price field must be filled in.
- Both fields being blank → inline error message, no entry created.

### After submit
- Show a brief `"Logged!"` success flash (auto-clears after 2.5 s).
- Clear the two price fields. Keep item + timestamp as-is (user likely
  wants to log another reading right away).

---

## BackupPanel

### Purpose
Export all data to JSON and import from a previously exported file.

### Props
```ts
interface BackupPanelProps {
  data: AppData;
  onImport: (imported: AppData) => void;
}
```

### Behaviour
- **Export**: serialises current `AppData` to a `.json` file download.
  Filename: `wow-ah-YYYY-MM-DD.json`.
- **Import**: file picker (hidden `<input type="file">`). Parses JSON,
  validates shape (must have `items[]` and `entries[]`), then **merges**
  with existing data:
  - New item names are appended (no duplicates).
  - New entries are appended (dedup by `id`).
  - Shows `alert()` on success or failure.
- Two buttons side by side: "Export JSON" | "Import JSON".
