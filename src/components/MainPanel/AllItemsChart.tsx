import { Line } from 'react-chartjs-2'
import type { PriceEntry } from '../../types'
import { priceLineOptions, seriesLineDataset } from '../../charts/theme'

interface Props {
  items: string[]
  entries: PriceEntry[]
}

export default function AllItemsChart({ items, entries }: Props) {
  const relevant = entries.filter(e => e.minBuyout !== null && e.marketPrice !== null)
  if (relevant.length === 0) {
    return <div className="chart-empty">No entries with both min buyout and market price yet.</div>
  }

  const timestamps = [...new Set(relevant.map(e => e.timestamp))].sort()
  const spreads    = relevant.map(e => (e.marketPrice as number) - (e.minBuyout as number))
  const maxSpread  = Math.max(0, ...spreads.map(Math.abs))

  const labels = timestamps.map(ts => {
    const d = new Date(ts)
    const dd = String(d.getDate()).padStart(2, '0')
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    return `${dd}.${mo}`
  })

  const datasets = items
    .filter(item => relevant.some(e => e.item === item))
    .map((item, i) => {
      const byTs = new Map(
        relevant.filter(e => e.item === item)
          .map(e => [e.timestamp, (e.marketPrice as number) - (e.minBuyout as number)])
      )
      return seriesLineDataset(item, timestamps.map(ts => byTs.get(ts) ?? null), i)
    })

  return (
    <Line
      data={{ labels, datasets }}
      options={priceLineOptions({ priceAxisMaxCopper: maxSpread, xMaxTicks: 14, legendPosition: 'bottom' })}
    />
  )
}
