"use client"
import React from 'react'
import type { Activity } from '../../types/health'

type Props = {
  activity: Activity
}

/**
 * RiskAnalysisCard
 * - Presents a conservative, educational "Why it matters" explanation for
 *   each clinical risk associated with an activity.
 * - This is intentionally non-diagnostic — language is conservative and
 *   focused on prevention / escalation cues.
 */
export default function RiskAnalysisCard({ activity }: Props) {
  return (
    <div className="card">
      <h3 className="font-semibold">Risk Analysis</h3>
      <p className="muted text-sm mt-2">Why it matters if warm-ups or gear are skipped.</p>

      <div className="mt-3 space-y-3">
        {activity.risks.map((r) => (
          <div key={r.id} className="p-3 rounded bg-[rgba(255,255,255,0.02)]">
            <div className="flex items-center justify-between">
              <div className="font-medium">{r.condition}</div>
              <div className="muted text-sm">Severity: {r.severityScore}/100</div>
            </div>
            <div className="muted text-sm mt-1">Mechanism: {r.mechanism}</div>
            <div className="mt-2">{
              // Conservative explanatory copy
              `Missing targeted warm-ups can increase risk by leaving tissues unprepared. ${r.clinicalOutcome}`
            }</div>
          </div>
        ))}
      </div>
    </div>
  )
}
