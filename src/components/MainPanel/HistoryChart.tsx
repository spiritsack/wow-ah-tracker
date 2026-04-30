import { Line } from 'react-chartjs-2'
import type { PriceEntry } from '../../types'
import { DAY_SHORT } from '../../store/time'
import {
  priceLineOptions,
  minBuyoutLineDataset,
  marketPriceLineDataset,
} from '../../charts/theme'

interface Props {
  entries: PriceEntry[]
}

export default function HistoryChart({ entries }: Props) {
  const sorted = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  if (sorted.length < 2) {
    return <div className="chart-empty">Not enough data to chart yet.</div>
  }

  const maxCopper = Math.max(0, ...sorted.flatMap(e => [e.minBuyout ?? 0, e.marketPrice ?? 0]))

  const labels = sorted.map(e => {
    const d = new Date(e.timestamp)
    return `${DAY_SHORT[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`
  })

  const data = {
    labels,
    datasets: [
      minBuyoutLineDataset('Min Buyout', sorted.map(e => e.minBuyout)),
      marketPriceLineDataset('Market Price', sorted.map(e => e.marketPrice)),
    ],
  }

  return <Line data={data} options={priceLineOptions({ priceAxisMaxCopper: maxCopper, xMaxTicks: 12 })} />
}
