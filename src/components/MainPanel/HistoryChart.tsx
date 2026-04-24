import { Line } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import type { PriceEntry } from '../../types'
import { formatGsc, yTickFormat, DAY_SHORT } from '../../store/helpers'

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
      {
        label: 'Min Buyout',
        data: sorted.map(e => e.minBuyout),
        borderColor: '#44cc88',
        backgroundColor: 'rgba(68,204,136,0.07)',
        pointBackgroundColor: '#44cc88',
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.25,
        spanGaps: true,
      },
      {
        label: 'Market Price',
        data: sorted.map(e => e.marketPrice),
        borderColor: '#5599dd',
        backgroundColor: 'rgba(85,153,221,0.07)',
        pointBackgroundColor: '#5599dd',
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.25,
        spanGaps: true,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
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
        ticks: { color: '#7a6a5a', font: { size: 10 }, maxTicksLimit: 12 },
        grid:  { color: 'rgba(46,40,32,0.5)' },
      },
      y: {
        ticks: { color: '#7a6a5a', font: { size: 10 }, callback: yTickFormat(maxCopper) },
        grid:  { color: 'rgba(46,40,32,0.5)' },
      },
    },
  }

  return <Line data={data} options={options} />
}
