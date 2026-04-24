import type { PriceEntry } from '../../types'
import AllItemsChart from './AllItemsChart'
import SpreadTable from './SpreadTable'
import HistoryChart from './HistoryChart'
import WeekdayChart from './WeekdayChart'
import WeekdayTable from './WeekdayTable'
import EntryList from './EntryList'

interface Props {
  selectedItem: string | null
  items: string[]
  entries: PriceEntry[]
  onUpdateEntry: (updated: PriceEntry) => void
  onDeleteEntry: (id: string) => void
}

export default function MainPanel({ selectedItem, items, entries, onUpdateEntry, onDeleteEntry }: Props) {
  const itemEntries = selectedItem ? entries.filter(e => e.item === selectedItem) : []

  return (
    <main className="main-panel">
      {!selectedItem ? (
        entries.length === 0 && (
          <div className="main-panel-empty">Select or add an item to view its price data.</div>
        )
      ) : (
        <>
          <h2 className="main-panel-title">
            {selectedItem}
            <span>{itemEntries.length} {itemEntries.length === 1 ? 'entry' : 'entries'}</span>
          </h2>

          <div className="charts-row">
            <div className="card">
              <div className="card-title">Price History</div>
              <div className="chart-box">
                <HistoryChart entries={itemEntries} />
              </div>
            </div>
            <div className="card">
              <div className="card-title">Weekday Averages</div>
              <div className="chart-box">
                <WeekdayChart entries={itemEntries} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Weekday Summary</div>
            <WeekdayTable entries={itemEntries} />
          </div>

          <div className="card">
            <div className="card-title">All Entries</div>
            <EntryList
              entries={itemEntries}
              onUpdate={onUpdateEntry}
              onDelete={onDeleteEntry}
            />
          </div>
        </>
      )}

      {entries.length > 0 && (
        <>
          <div className="card">
            <div className="card-title">All Items — Market Price minus Min Buyout</div>
            <div className="chart-box chart-box--overview">
              <AllItemsChart items={items} entries={entries} />
            </div>
          </div>
          <div className="card">
            <div className="card-title">Price Spread — Most Underpriced First</div>
            <SpreadTable items={items} entries={entries} />
          </div>
        </>
      )}
    </main>
  )
}
