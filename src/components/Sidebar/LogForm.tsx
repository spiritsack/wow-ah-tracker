import { useState, useEffect } from 'react'
import type { PriceEntry } from '../../types'
import { nowDatetimeLocal } from '../../store/time'
import GscInput from '../GscInput'

interface Props {
  items: string[]
  selectedItem: string | null
  onSelectItem: (name: string) => void
  onLog: (entry: Omit<PriceEntry, 'id'>) => void
}

export default function LogForm({ items, selectedItem, onSelectItem, onLog }: Props) {
  const [item, setItem]       = useState(selectedItem ?? '')
  const [minBuyout, setMin]   = useState<number | null>(null)
  const [marketPrice, setMkt] = useState<number | null>(null)
  const [timestamp, setTs]    = useState(nowDatetimeLocal())
  const [flash, setFlash]     = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  // Keep local select in sync with external selectedItem
  useEffect(() => {
    if (selectedItem) setItem(selectedItem)
  }, [selectedItem])

  function handleItemChange(name: string) {
    setItem(name)
    if (name) onSelectItem(name)
  }

  function handleSubmit() {
    if (!item) { showFlash('Select an item first.', 'err'); return }
    if (minBuyout === null && marketPrice === null) {
      showFlash('Enter at least one price.', 'err')
      return
    }
    onLog({ item, minBuyout, marketPrice, timestamp: new Date(timestamp).toISOString() })
    setMin(null)
    setMkt(null)
    setTs(nowDatetimeLocal())
    showFlash('Logged!', 'ok')
    const idx = items.indexOf(item)
    if (idx !== -1) {
      const next = items[(idx + 1) % items.length]
      onSelectItem(next)
    }
  }

  function showFlash(msg: string, type: 'ok' | 'err') {
    setFlash({ msg, type })
    setTimeout(() => setFlash(null), 2500)
  }

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit() }}>
      <div className="field">
        <label className="field-label">Item</label>
        <select value={item} onChange={e => handleItemChange(e.target.value)}>
          <option value="">— select item —</option>
          {items.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="field">
        <label className="field-label">Min Buyout</label>
        <GscInput value={minBuyout} onChange={setMin} />
      </div>

      <div className="field">
        <label className="field-label">Market Price</label>
        <GscInput value={marketPrice} onChange={setMkt} />
      </div>

      <div className="field">
        <label className="field-label">Date &amp; Time</label>
        <input
          type="datetime-local"
          value={timestamp}
          onChange={e => setTs(e.target.value)}
        />
      </div>

      <button className="btn btn--gold" type="submit">Log Price</button>

      {flash && <div className={`flash flash--${flash.type}`}>{flash.msg}</div>}
    </form>
  )
}
