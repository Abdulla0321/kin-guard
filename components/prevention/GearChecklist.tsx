"use client"
import React, { useMemo, useState } from 'react'

type Props = {
  items: string[]
}

/**
 * GearChecklist
 * - Simple checklist with toggleable readiness states.
 * - Returns a readiness percentage that UI can use to encourage compliance.
 */
export default function GearChecklist({ items }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (item: string) => setChecked((c) => ({ ...c, [item]: !c[item] }))

  const readiness = useMemo(() => {
    const total = items.length
    if (total === 0) return 100
    const done = items.filter((i) => checked[i]).length
    return Math.round((done / total) * 100)
  }, [items, checked])

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Gear Checklist</h3>
        <div className="muted text-sm">Readiness: {readiness}%</div>
      </div>

      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex items-center justify-between">
            <div className="text-sm">{it}</div>
            <div>
              <button onClick={() => toggle(it)} className={`px-3 py-1 rounded ${checked[it] ? 'bg-kineticLime text-black' : 'bg-[rgba(255,255,255,0.03)]'}`}>
                {checked[it] ? 'Ready' : 'Mark'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
