"use client"
import React from 'react'
import type { TriageResult } from '../../types/health'

type Props = { result: TriageResult }

export default function TriageResultCard({ result }: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Triage Result</h3>
        <div className={`px-2 py-1 rounded text-sm ${result.urgent ? 'bg-dangerAlert text-white' : 'bg-[rgba(255,255,255,0.03)] muted'}`}>
          {result.urgent ? 'Urgent' : 'Self-care'}
        </div>
      </div>

      <div className="mt-3">
        <div className="font-medium">Reasons</div>
        <ul className="mt-2 list-disc list-inside">
          {result.reason.map((r, i) => (
            <li key={i} className="muted text-sm">{r}</li>
          ))}
        </ul>

        <div className="mt-3 font-medium">Recommendation</div>
        <div className="mt-1 muted text-sm whitespace-pre-wrap">{result.recommendation}</div>

        {result.referToClinician && (
          <div className="mt-3 p-3 rounded bg-[rgba(239,68,68,0.06)] border-l-4 border-dangerAlert text-sm">
            Please arrange clinician review — this recommendation errs on the side of caution.
          </div>
        )}
      </div>
    </div>
  )
}
