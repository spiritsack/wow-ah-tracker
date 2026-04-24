import { useRef, KeyboardEvent } from 'react'
import type { PriceEntry } from '../../types'

interface Props {
  items: string[]
  entries: PriceEntry[]
  selectedItem: string | null
  onSelect: (name: string) => void
  onAdd: (name: string) => void
  onDelete: (name: string) => void
}

export default function ItemList({ items, entries, selectedItem, onSelect, onAdd, onDelete }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd() {
    const name = inputRef.current?.value.trim() ?? ''
    if (!name) return
    onAdd(name)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd()
  }

  function handleDelete(e: React.MouseEvent, name: string) {
    e.stopPropagation()
    if (confirm(`Delete "${name}" and all its price entries?`)) onDelete(name)
  }

  const count = (name: string) => entries.filter(e => e.item === name).length

  return (
    <div>
      <div className="item-add-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="Item name..."
          onKeyDown={handleKey}
        />
        <button className="btn btn--outline btn--sm" onClick={handleAdd}>+ Add</button>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No items yet.</p>
      ) : (
        <div className="item-list">
          {items.map(name => (
            <button
              key={name}
              className={`item-row${selectedItem === name ? ' item-row--active' : ''}`}
              onClick={() => onSelect(name)}
            >
              <span className="item-row-name">{name}</span>
              <span className="item-row-right">
                <span className="badge">{count(name)}</span>
                <button
                  className="btn btn--ghost btn--danger"
                  onClick={e => handleDelete(e, name)}
                  title="Delete item"
                >
                  &times;
                </button>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
