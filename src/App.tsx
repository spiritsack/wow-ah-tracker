import { useState } from 'react'
import type { AppData, PriceEntry } from './types'
import {
  loadData,
  saveData,
  addItem    as storeAddItem,
  deleteItem as storeDeleteItem,
  addEntry,
  updateEntry,
  deleteEntry,
} from './store/storage'
import { uid } from './store/helpers'
import Sidebar from './components/Sidebar/Sidebar'
import MainPanel from './components/MainPanel/MainPanel'

export default function App() {
  const [data, setData] = useState<AppData>(loadData)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  function mutate(next: AppData) {
    saveData(next)
    setData(next)
  }

  function handleAddItem(name: string) {
    mutate(storeAddItem(data, name))
    setSelectedItem(name)
  }

  function handleDeleteItem(name: string) {
    mutate(storeDeleteItem(data, name))
    if (selectedItem === name) setSelectedItem(null)
  }

  function handleLog(entry: Omit<PriceEntry, 'id'>) {
    mutate(addEntry(data, { ...entry, id: uid() }))
  }

  function handleUpdateEntry(updated: PriceEntry) {
    mutate(updateEntry(data, updated))
  }

  function handleDeleteEntry(id: string) {
    mutate(deleteEntry(data, id))
  }

  function handleImport(imported: AppData) {
    const merged: AppData = {
      items: [...data.items],
      entries: [...data.entries],
    }
    for (const name of imported.items) {
      if (!merged.items.includes(name)) merged.items.push(name)
    }
    const existingIds = new Set(data.entries.map(e => e.id))
    for (const entry of imported.entries) {
      if (!existingIds.has(entry.id)) merged.entries.push(entry)
    }
    mutate(merged)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>WoW TBC Anniversary &mdash; AH Price Tracker</h1>
          <p>Log minbuyout &amp; market prices &middot; spot weekday trends</p>
        </div>
      </header>
      <div className="app-layout">
        <Sidebar
          data={data}
          selectedItem={selectedItem}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onSelectItem={setSelectedItem}
          onLog={handleLog}
          onImport={handleImport}
        />
        <MainPanel
          selectedItem={selectedItem}
          items={data.items}
          entries={data.entries}
          onUpdateEntry={handleUpdateEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </div>
    </div>
  )
}
