import { Bar } from 'react-chartjs-2'
import type { PriceEntry } from '../../types'
import { getWeekdayStats } from '../../store/weekdayStats'
import { WKORDER, DAY_SHORT } from '../../store/time'
import {
  priceBarOptions,
  minBuyoutBarDataset,
  marketPriceBarDataset,
} from '../../charts/theme'

interface Props {
  entries: PriceEntry[]
}

export default function WeekdayChart({ entries }: Props) {
  if (entries.length === 0) {
    return <div className="chart-empty">No data yet.</div>
  }

  const maxCopper = Math.max(0, ...entries.flatMap(e => [e.minBuyout ?? 0, e.marketPrice ?? 0]))
  const stats = getWeekdayStats(entries)

  const data = {
    labels: WKORDER.map(d => DAY_SHORT[d]),
    datasets: [
      minBuyoutBarDataset('Min Buyout avg', WKORDER.map(d => stats[d].minBuyout.avg)),
      marketPriceBarDataset('Market Price avg', WKORDER.map(d => stats[d].marketPrice.avg)),
    ],
  }

  return <Bar data={data} options={priceBarOptions({ priceAxisMaxCopper: maxCopper })} />
}
