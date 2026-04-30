import type { AppData, PriceEntry } from '../types';
import { parseAppData } from './parseAppData';

const KEY = 'wowAH';
const EMPTY: AppData = { items: [], entries: [] };

export function loadData(): AppData {
  const raw = localStorage.getItem(KEY);
  if (!raw) return EMPTY;
  const result = parseAppData(raw);
  return result.ok ? result.data : EMPTY;
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function addItem(data: AppData, name: string): AppData {
  if (data.items.includes(name)) return data;
  return { ...data, items: [...data.items, name] };
}

export function deleteItem(data: AppData, name: string): AppData {
  return {
    items:   data.items.filter(i => i !== name),
    entries: data.entries.filter(e => e.item !== name),
  };
}

export function addEntry(data: AppData, entry: PriceEntry): AppData {
  return { ...data, entries: [...data.entries, entry] };
}

export function updateEntry(data: AppData, updated: PriceEntry): AppData {
  return {
    ...data,
    entries: data.entries.map(e => e.id === updated.id ? updated : e),
  };
}

export function deleteEntry(data: AppData, id: string): AppData {
  return { ...data, entries: data.entries.filter(e => e.id !== id) };
}
