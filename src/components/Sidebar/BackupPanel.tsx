import { useRef } from 'react'
import type { AppData } from '../../types'

interface Props {
  data: AppData
  onImport: (imported: AppData) => void
}

export default function BackupPanel({ data, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `wow-ah-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as unknown
        if (
          typeof parsed !== 'object' || parsed === null ||
          !Array.isArray((parsed as AppData).items) ||
          !Array.isArray((parsed as AppData).entries)
        ) throw new Error('Invalid format')
        onImport(parsed as AppData)
        alert('Imported successfully!')
      } catch (err) {
        alert('Import failed: ' + (err as Error).message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="backup-row">
      <button className="btn btn--outline" onClick={handleExport}>Export JSON</button>
      <button className="btn btn--outline" onClick={() => fileRef.current?.click()}>Import JSON</button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}
