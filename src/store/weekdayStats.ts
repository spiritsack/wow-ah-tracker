import type { PriceEntry, WeekdayStats, DayStat } from '../types';

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
