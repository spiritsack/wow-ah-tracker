import { useRef } from 'react'
import type { AppData } from '../../types'
import { parseAppData } from '../../store/parseAppData'

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
      const result = parseAppData(ev.target?.result as string)
      if (result.ok) {
        onImport(result.data)
        alert('Imported successfully!')
      } else {
        alert('Import failed: ' + result.reason)
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
