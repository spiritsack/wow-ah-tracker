import { useState } from 'react'
import type { PriceEntry } from '../../types'
import { formatGsc, formatDate, isoToDatetimeLocal } from '../../store/helpers'
import GscInput from '../GscInput'

interface Props {
  entries: PriceEntry[]
  onUpdate: (updated: PriceEntry) => void
  onDelete: (id: string) => void
}

interface EditState {
  id: string
  minBuyout: number | null
  marketPrice: number | null
  timestamp: string  // datetime-local format
}

export default function EntryList({ entries, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<EditState | null>(null)

  const sorted = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  function startEdit(e: PriceEntry) {
    setEditing({
      id: e.id,
      minBuyout: e.minBuyout,
      marketPrice: e.marketPrice,
      timestamp: isoToDatetimeLocal(e.timestamp),
    })
  }

  function cancelEdit() { setEditing(null) }

  function saveEdit(original: PriceEntry) {
    if (!editing) return
    onUpdate({
      ...original,
      minBuyout:   editing.minBuyout,
      marketPrice: editing.marketPrice,
      timestamp:   new Date(editing.timestamp).toISOString(),
    })
    setEditing(null)
  }

  if (sorted.length === 0) {
    return <p className="empty-state">No entries yet.</p>
  }

  return (
    <div className="entry-list">
      {sorted.map(entry => {
        const isEditing = editing?.id === entry.id

        if (isEditing && editing) {
          return (
            <div key={entry.id} className="entry-row entry-row--editing">
              <div className="edit-fields">
                <div className="edit-field-group">
                  <span className="edit-field-label">Min Buyout</span>
                  <GscInput
                    value={editing.minBuyout}
                    onChange={v => setEditing({ ...editing, minBuyout: v })}
                  />
                </div>
                <div className="edit-field-group">
                  <span className="edit-field-label">Market Price</span>
                  <GscInput
                    value={editing.marketPrice}
                    onChange={v => setEditing({ ...editing, marketPrice: v })}
                  />
                </div>
                <div className="edit-field-group">
                  <span className="edit-field-label">Date &amp; Time</span>
                  <input
                    type="datetime-local"
                    value={editing.timestamp}
                    onChange={e => setEditing({ ...editing, timestamp: e.target.value })}
                  />
                </div>
              </div>
              <div className="entry-actions">
                <button className="btn btn--ghost btn--save" onClick={() => saveEdit(entry)}>Save</button>
                <button className="btn btn--ghost" onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          )
        }

        return (
          <div key={entry.id} className="entry-row">
            <span className="entry-date">{formatDate(entry.timestamp)}</span>
            <span className="entry-min">Min: {formatGsc(entry.minBuyout)}</span>
            <span className="entry-mkt">Mkt: {formatGsc(entry.marketPrice)}</span>
            <div className="entry-actions">
              <button
                className="btn btn--ghost"
                onClick={() => startEdit(entry)}
                title="Edit"
              >
                Edit
              </button>
              <button
                className="btn btn--ghost btn--danger"
                onClick={() => onDelete(entry.id)}
                title="Delete"
              >
                &times;
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
