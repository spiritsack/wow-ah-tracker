import type { ChartDataset, ChartOptions } from 'chart.js'
import { formatGsc, priceAxisTickFormatter } from '../money'

const COLOR = {
  bgCard: '#161624',
  border: '#2e2820',
  gold:   '#c8a84b',
  text:   '#d4b896',
  muted:  '#7a6a5a',
  green:  '#44cc88',
  blue:   '#5599dd',
} as const

const GRID = 'rgba(46,40,32,0.5)'

const SERIES_PALETTE = [
  '#c8a84b', '#44cc88', '#5599dd', '#dd5577', '#bb55dd',
  '#dd9944', '#55ddcc', '#dd55aa', '#99dd55', '#5577dd',
  '#ddcc44', '#55aadd',
]

const TOOLTIP_COSMETIC = {
  backgroundColor: COLOR.bgCard,
  borderColor: COLOR.border,
  borderWidth: 1,
  titleColor: COLOR.gold,
  bodyColor: COLOR.text,
} as const

interface PriceLineOptionsArgs {
  priceAxisMaxCopper: number
  xMaxTicks?: number
  legendPosition?: 'top' | 'bottom'
}

interface PriceBarOptionsArgs {
  priceAxisMaxCopper: number
}

export function priceLineOptions({
  priceAxisMaxCopper,
  xMaxTicks,
  legendPosition = 'top',
}: PriceLineOptionsArgs): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: legendPosition,
        labels: {
          color: COLOR.text,
          font: { size: 11 },
          boxWidth: 12,
          ...(legendPosition === 'bottom' ? { padding: 16 } : {}),
        },
      },
      tooltip: {
        ...TOOLTIP_COSMETIC,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${formatGsc(ctx.raw as number | null)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: COLOR.muted,
          font: { size: 10 },
          ...(xMaxTicks !== undefined ? { maxTicksLimit: xMaxTicks } : {}),
        },
        grid: { color: GRID },
      },
      y: {
        ticks: {
          color: COLOR.muted,
          font: { size: 10 },
          callback: priceAxisTickFormatter(priceAxisMaxCopper),
        },
        grid: { color: GRID },
      },
    },
  }
}

export function priceBarOptions({
  priceAxisMaxCopper,
}: PriceBarOptionsArgs): ChartOptions<'bar'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: COLOR.text, font: { size: 11 }, boxWidth: 12 },
      },
      tooltip: {
        ...TOOLTIP_COSMETIC,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${formatGsc(ctx.raw as number | null)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: COLOR.muted, font: { size: 10 } },
        grid: { color: GRID },
      },
      y: {
        ticks: {
          color: COLOR.muted,
          font: { size: 10 },
          callback: priceAxisTickFormatter(priceAxisMaxCopper),
        },
        grid: { color: GRID },
      },
    },
  }
}

export function minBuyoutLineDataset(
  label: string,
  data: Array<number | null>,
): ChartDataset<'line', Array<number | null>> {
  return {
    label,
    data,
    borderColor: COLOR.green,
    backgroundColor: 'rgba(68,204,136,0.07)',
    pointBackgroundColor: COLOR.green,
    pointRadius: 3,
    pointHoverRadius: 5,
    tension: 0.25,
    spanGaps: true,
  }
}

export function marketPriceLineDataset(
  label: string,
  data: Array<number | null>,
): ChartDataset<'line', Array<number | null>> {
  return {
    label,
    data,
    borderColor: COLOR.blue,
    backgroundColor: 'rgba(85,153,221,0.07)',
    pointBackgroundColor: COLOR.blue,
    pointRadius: 3,
    pointHoverRadius: 5,
    tension: 0.25,
    spanGaps: true,
  }
}

export function minBuyoutBarDataset(
  label: string,
  data: Array<number | null>,
): ChartDataset<'bar', Array<number | null>> {
  return {
    label,
    data,
    backgroundColor: 'rgba(68,204,136,0.55)',
    borderColor: COLOR.green,
    borderWidth: 1,
    borderRadius: 3,
  }
}

export function marketPriceBarDataset(
  label: string,
  data: Array<number | null>,
): ChartDataset<'bar', Array<number | null>> {
  return {
    label,
    data,
    backgroundColor: 'rgba(85,153,221,0.55)',
    borderColor: COLOR.blue,
    borderWidth: 1,
    borderRadius: 3,
  }
}

export function seriesLineDataset(
  label: string,
  data: Array<number | null>,
  index: number,
): ChartDataset<'line', Array<number | null>> {
  const color = SERIES_PALETTE[index % SERIES_PALETTE.length]
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: color + '18',
    pointBackgroundColor: color,
    pointRadius: 3,
    pointHoverRadius: 5,
    tension: 0.25,
    spanGaps: true,
  }
}
