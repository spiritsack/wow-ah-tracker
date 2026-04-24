import { useEffect, useState } from 'react'
import { copperToGsc } from '../store/helpers'

interface Props {
  value: number | null
  onChange: (copper: number | null) => void
}

function toDisplay(copper: number | null): string {
  if (copper === null) return ''
  const { g, s, c } = copperToGsc(copper)
  return `${g * 100 + s},${String(c).padStart(2, '0')}`
}

function parse(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const comma = trimmed.indexOf(',')
  const silverStr = comma === -1 ? trimmed : trimmed.slice(0, comma)
  const copperStr = comma === -1 ? '0' : trimmed.slice(comma + 1)
  const silverTotal = parseInt(silverStr, 10)
  if (isNaN(silverTotal) || silverTotal < 0) return null
  const c = Math.min(99, Math.max(0, parseInt(copperStr, 10) || 0))
  return silverTotal * 100 + c
}

export default function GscInput({ value, onChange }: Props) {
  const [text, setText] = useState(() => toDisplay(value))

  useEffect(() => {
    if (value === null) setText('')
  }, [value])

  function handleChange(raw: string) {
    setText(raw)
    onChange(parse(raw))
  }

  return (
    <input
      type="text"
      className="gsc-input"
      value={text}
      placeholder="0,00"
      onChange={e => handleChange(e.target.value)}
      inputMode="decimal"
    />
  )
}
