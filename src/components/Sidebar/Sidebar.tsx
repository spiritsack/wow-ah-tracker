import type { AppData, PriceEntry } from '../../types'
import ItemList from './ItemList'
import LogForm from './LogForm'
import BackupPanel from './BackupPanel'

interface Props {
  data: AppData
  selectedItem: string | null
  onAddItem: (name: string) => void
  onDeleteItem: (name: string) => void
  onSelectItem: (name: string) => void
  onLog: (entry: Omit<PriceEntry, 'id'>) => void
  onImport: (imported: AppData) => void
}

export default function Sidebar({
  data, selectedItem,
  onAddItem, onDeleteItem, onSelectItem, onLog, onImport,
}: Props) {
  return (
    <aside className="sidebar">
      <div className="card">
        <div className="card-title">Items</div>
        <ItemList
          items={data.items}
          entries={data.entries}
          selectedItem={selectedItem}
          onSelect={onSelectItem}
          onAdd={onAddItem}
          onDelete={onDeleteItem}
        />
      </div>

      <div className="card">
        <div className="card-title">Log Price</div>
        <LogForm
          items={data.items}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          onLog={onLog}
        />
      </div>

      <div className="card">
        <div className="card-title">Backup</div>
        <BackupPanel data={data} onImport={onImport} />
      </div>
    </aside>
  )
}
