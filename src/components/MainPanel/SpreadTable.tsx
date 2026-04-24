import type { PriceEntry } from '../../types'
import { formatGsc } from '../../store/helpers'

interface Props {
  items: string[]
  entries: PriceEntry[]
}

interface Row {
  item: string
  minBuyout: number
  marketPrice: number
  spread: number
  pct: number
}

function latestValue(entries: PriceEntry[], field: 'minBuyout' | 'marketPrice'): number | null {
  const hit = [...entries]
    .filter(e => e[field] !== null)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
  return hit ? (hit[field] as number) : null
}

export default function SpreadTable({ items, entries }: Props) {
  const rows: Row[] = items
    .map(item => {
      const ie  = entries.filter(e => e.item === item)
      const min = latestValue(ie, 'minBuyout')
      const mkt = latestValue(ie, 'marketPrice')
      if (min === null || mkt === null) return null
      const spread = mkt - min
      const pct    = (spread / mkt) * 100
      return { item, minBuyout: min, marketPrice: mkt, spread, pct }
    })
    .filter((r): r is Row => r !== null)
    .sort((a, b) => b.pct - a.pct)

  if (rows.length === 0) {
    return <p className="empty-state">No items have both min buyout and market price logged yet.</p>
  }

  return (
    <table className="wk-table">
      <thead>
        <tr>
          <th>Item</th>
          <th className="c-green">Min Buyout</th>
          <th className="c-blue">Market Price</th>
          <th>Spread</th>
          <th>% below mkt</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.item} className={rowClass(r.pct)}>
            <td>{r.item}</td>
            <td className="c-green">{formatGsc(r.minBuyout)}</td>
            <td className="c-blue">{formatGsc(r.marketPrice)}</td>
            <td className="c-muted">{formatGsc(Math.abs(r.spread))}</td>
            <td className="spread-pct">{r.pct >= 0 ? '+' : ''}{r.pct.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function rowClass(pct: number): string {
  if (pct >= 20) return 'spread-row--hot'
  if (pct >= 8)  return 'spread-row--warm'
  if (pct < 0)   return 'spread-row--over'
  return ''
}
