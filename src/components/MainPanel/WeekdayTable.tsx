import type { PriceEntry } from '../../types'
import { getWeekdayStats } from '../../store/weekdayStats'
import { WKORDER, DAY_FULL } from '../../store/time'
import { formatGsc } from '../../money'

interface Props {
  entries: PriceEntry[]
}

export default function WeekdayTable({ entries }: Props) {
  if (entries.length === 0) {
    return <p className="empty-state">No data yet.</p>
  }

  const stats   = getWeekdayStats(entries)
  const today   = new Date().getDay()
  const tomorrow = (today + 1) % 7

  return (
    <table className="wk-table">
      <thead>
        <tr>
          <th>Day</th>
          <th>Entries</th>
          <th className="c-green">Min Buyout avg</th>
          <th className="c-muted">Range</th>
          <th className="c-blue">Market Price avg</th>
          <th className="c-muted">Range</th>
        </tr>
      </thead>
      <tbody>
        {WKORDER.map(d => {
          const s        = stats[d]
          const isToday  = d === today
          const isTmrw   = d === tomorrow
          const rowClass = isToday ? 'is-today' : isTmrw ? 'is-tmrw' : ''

          const minRange = s.minBuyout.lo !== null
            ? `${formatGsc(s.minBuyout.lo)} – ${formatGsc(s.minBuyout.hi)}`
            : '—'
          const mktRange = s.marketPrice.lo !== null
            ? `${formatGsc(s.marketPrice.lo)} – ${formatGsc(s.marketPrice.hi)}`
            : '—'

          return (
            <tr key={d} className={rowClass}>
              <td>
                {DAY_FULL[d]}
                {isToday && <span className="tag tag--today">Today</span>}
                {isTmrw  && <span className="tag tag--tmrw">Tomorrow</span>}
              </td>
              <td className="c-muted">{s.count || '—'}</td>
              <td className="c-green">{formatGsc(s.minBuyout.avg)}</td>
              <td className="c-muted">{minRange}</td>
              <td className="c-blue">{formatGsc(s.marketPrice.avg)}</td>
              <td className="c-muted">{mktRange}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
