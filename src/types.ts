export interface PriceEntry {
  id: string;
  item: string;
  minBuyout: number | null;    // integer copper
  marketPrice: number | null;  // integer copper
  timestamp: string;           // ISO 8601
}

export interface AppData {
  items: string[];
  entries: PriceEntry[];
}

export interface DayStat {
  count: number;
  minBuyout:   { avg: number | null; lo: number | null; hi: number | null };
  marketPrice: { avg: number | null; lo: number | null; hi: number | null };
}

export type WeekdayStats = Record<number, DayStat>;
