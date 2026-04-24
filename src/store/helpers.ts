import type { PriceEntry, WeekdayStats, DayStat } from '../types';

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function copperToGsc(copper: number): { g: number; s: number; c: number } {
  const total = Math.round(Math.abs(copper));
  const g = Math.floor(total / 10000);
  const s = Math.floor((total % 10000) / 100);
  const c = total % 100;
  return { g, s, c };
}

export function gscToCopper(g: number, s: number, c: number): number {
  return g * 10000 + s * 100 + c;
}

export function yTickFormat(maxCopper: number): (v: number | string) => string | number {
  if (maxCopper >= 10000) return v => typeof v === 'number' ? (v / 10000).toFixed(1) + 'g' : v
  if (maxCopper >= 100)   return v => typeof v === 'number' ? (v / 100).toFixed(0) + 's' : v
  return v => typeof v === 'number' ? v.toFixed(0) + 'c' : v
}

export function formatGsc(copper: number | null): string {
  if (copper === null) return '—';
  const { g, s, c } = copperToGsc(copper);
  if (g > 0) return `${g}g ${s}s ${c}c`;
  if (s > 0) return `${s}s ${c}c`;
  return `${c}c`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dd   = String(d.getDate()).padStart(2, '0');
  const mo   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh   = String(d.getHours()).padStart(2, '0');
  const mm   = String(d.getMinutes()).padStart(2, '0');
  return `${days[d.getDay()]} ${dd}.${mo}.${yyyy} ${hh}:${mm}`;
}

export function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function nowDatetimeLocal(): string {
  return isoToDatetimeLocal(new Date().toISOString());
}

function meanCopper(vals: number[]): number | null {
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function getWeekdayStats(entries: PriceEntry[]): WeekdayStats {
  const stats: WeekdayStats = {};
  for (let d = 0; d < 7; d++) {
    const de   = entries.filter(e => new Date(e.timestamp).getDay() === d);
    const mins = de.map(e => e.minBuyout).filter((v): v is number => v !== null);
    const mkts = de.map(e => e.marketPrice).filter((v): v is number => v !== null);
    const stat: DayStat = {
      count: de.length,
      minBuyout: {
        avg: meanCopper(mins),
        lo:  mins.length ? Math.min(...mins) : null,
        hi:  mins.length ? Math.max(...mins) : null,
      },
      marketPrice: {
        avg: meanCopper(mkts),
        lo:  mkts.length ? Math.min(...mkts) : null,
        hi:  mkts.length ? Math.max(...mkts) : null,
      },
    };
    stats[d] = stat;
  }
  return stats;
}

// Mon–Sun ordering (JS day 0=Sun…6=Sat)
export const WKORDER = [1, 2, 3, 4, 5, 6, 0];
export const DAY_FULL  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
