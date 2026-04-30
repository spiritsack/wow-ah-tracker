import type { AppData } from '../types';

export type ParseResult =
  | { ok: true; data: AppData }
  | { ok: false; reason: string };

export function parseAppData(raw: string): ParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return { ok: false, reason: (err as Error).message };
  }
  if (
    typeof parsed !== 'object' || parsed === null ||
    !Array.isArray((parsed as AppData).items) ||
    !Array.isArray((parsed as AppData).entries)
  ) {
    return { ok: false, reason: 'Invalid format' };
  }
  return { ok: true, data: parsed as AppData };
}
