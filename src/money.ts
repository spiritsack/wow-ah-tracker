export function copperToGsc(copper: number): { g: number; s: number; c: number } {
  const total = Math.round(Math.abs(copper));
  const g = Math.floor(total / 10000);
  const s = Math.floor((total % 10000) / 100);
  const c = total % 100;
  return { g, s, c };
}

export function formatGsc(copper: number | null): string {
  if (copper === null) return '—';
  const { g, s, c } = copperToGsc(copper);
  if (g > 0) return `${g}g ${s}s ${c}c`;
  if (s > 0) return `${s}s ${c}c`;
  return `${c}c`;
}

export function priceAxisTickFormatter(
  maxCopper: number,
): (v: number | string) => string | number {
  if (maxCopper >= 10000) return v => typeof v === 'number' ? (v / 10000).toFixed(1) + 'g' : v;
  if (maxCopper >= 100)   return v => typeof v === 'number' ? (v / 100).toFixed(0) + 's' : v;
  return v => typeof v === 'number' ? v.toFixed(0) + 'c' : v;
}
