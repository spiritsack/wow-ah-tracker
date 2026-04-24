import { Line } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import type { PriceEntry } from '../../types'
import { formatGsc, yTickFormat } from '../../store/helpers'

const PALETTE = [
  '#c8a84b', '#44cc88', '#5599dd', '#dd5577', '#bb55dd',
  '#dd9944', '#55ddcc', '#dd55aa', '#99dd55', '#5577dd',
  '#ddcc44', '#55aadd',
]

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
      const color = PALETTE[i % PALETTE.length]
      return {
        label: item,
        data: timestamps.map(ts => byTs.get(ts) ?? null),
        borderColor: color,
        backgroundColor: color + '18',
        pointBackgroundColor: color,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.25,
        spanGaps: true,
      }
    })

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#d4b896', font: { size: 11 }, boxWidth: 12, padding: 16 },
      },
      tooltip: {
        backgroundColor: '#161624',
        borderColor: '#2e2820',
        borderWidth: 1,
        titleColor: '#c8a84b',
        bodyColor: '#d4b896',
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${formatGsc(ctx.raw as number | null)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#7a6a5a', font: { size: 10 }, maxTicksLimit: 14 },
        grid:  { color: 'rgba(46,40,32,0.5)' },
      },
      y: {
        ticks: { color: '#7a6a5a', font: { size: 10 }, callback: yTickFormat(maxSpread) },
        grid:  { color: 'rgba(46,40,32,0.5)' },
      },
    },
  }

  return <Line data={{ labels, datasets }} options={options} />
}
