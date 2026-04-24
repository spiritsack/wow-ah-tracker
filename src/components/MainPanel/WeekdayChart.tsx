import { Bar } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import type { PriceEntry } from '../../types'
import { getWeekdayStats, formatGsc, yTickFormat, WKORDER, DAY_SHORT } from '../../store/helpers'

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
      {
        label: 'Min Buyout avg',
        data: WKORDER.map(d => stats[d].minBuyout.avg),
        backgroundColor: 'rgba(68,204,136,0.55)',
        borderColor: '#44cc88',
        borderWidth: 1,
        borderRadius: 3,
      },
      {
        label: 'Market Price avg',
        data: WKORDER.map(d => stats[d].marketPrice.avg),
        backgroundColor: 'rgba(85,153,221,0.55)',
        borderColor: '#5599dd',
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#d4b896', font: { size: 11 }, boxWidth: 12 },
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
        ticks: { color: '#7a6a5a', font: { size: 10 } },
        grid:  { color: 'rgba(46,40,32,0.5)' },
      },
      y: {
        ticks: { color: '#7a6a5a', font: { size: 10 }, callback: yTickFormat(maxCopper) },
        grid:  { color: 'rgba(46,40,32,0.5)' },
      },
    },
  }

  return <Bar data={data} options={options} />
}
