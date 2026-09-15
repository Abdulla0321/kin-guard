"use client"
import React, { useMemo, useState } from 'react'
import type { SymptomReport, PainScale, SensationTag } from '../../types/health'
import { ACTIVITIES } from '../../data/activities'
import { evaluateTriage } from '../../lib/triage-engine'
import TriageResultCard from './TriageResultCard'
import Disclaimer from './Disclaimer'

const BODY_REGIONS = [
  'Head', 'Neck', 'Left Shoulder', 'Right Shoulder', 'Chest', 'Back', 'Left Arm', 'Right Arm',
  'Abdomen', 'Left Hip', 'Right Hip', 'Left Thigh', 'Right Thigh', 'Left Knee', 'Right Knee',
  'Left Ankle', 'Right Ankle'
]

const SENSATION_TAGS = ['sharp', 'burning', 'dull', 'tingling', 'numbness', 'pop', 'click'] as const

export default function SymptomIntakeForm() {
  const [activityId, setActivityId] = useState<string | undefined>(undefined)
  const [zone, setZone] = useState<string>('Right Knee')
  const [pain, setPain] = useState<number>(4)
  const [onset, setOnset] = useState<'acute' | 'gradual' | 'delayed'>('acute')
  const [tags, setTags] = useState<SensationTag[]>([])
  const [notes, setNotes] = useState<string>('')
  const [result, setResult] = useState<ReturnType<typeof evaluateTriage> | null>(null)

  const toggleTag = (t: SensationTag) => setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const computedPain = Math.max(1, Math.min(10, Math.round(pain))) as PainScale
    const report: SymptomReport = {
      activityId,
      zone,
      pain: computedPain,
      onset,
      tags: tags as SensationTag[],
      notes
    }

    const triage = evaluateTriage(report)
    setResult(triage)
  }

  const readiness = useMemo(() => {
    // Quick heuristic: lower pain and non-urgent tag set -> considered low risk
    if (!result) return null
    return result.urgent ? 'Not Safe' : 'May Self-Manage'
  }, [result])

  return (
    <div className="card">
      <Disclaimer />

      <h3 className="font-semibold">Post-Activity Symptom Checker</h3>
      <p className="muted text-sm mt-2">Answer a few questions to get conservative triage guidance.</p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label className="text-sm muted">Activity (optional)</label>
          <select value={activityId} onChange={(e) => setActivityId(e.target.value)} className="w-full mt-1 p-2 rounded bg-[rgba(255,255,255,0.02)]">
            <option value={undefined as unknown as string}>-- Select activity --</option>
            {ACTIVITIES.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm muted">Body region</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {BODY_REGIONS.map((r) => (
              <button key={r} type="button" onClick={() => setZone(r)} className={`p-2 rounded text-sm ${zone === r ? 'ring-2 ring-electricEmerald/50 bg-[rgba(255,255,255,0.02)]' : 'bg-[rgba(255,255,255,0.01)]'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm muted">Pain: <strong>{pain}</strong></label>
          <input type="range" min={1} max={10} value={pain} onChange={(e) => setPain(Number(e.target.value))} className="w-full mt-2" />
        </div>

        <div>
          <label className="text-sm muted">Onset</label>
          <div className="mt-2 flex gap-2">
            {(['acute', 'gradual', 'delayed'] as const).map((o) => (
              <label key={o} className="text-sm">
                <input type="radio" name="onset" value={o} checked={onset === o} onChange={() => setOnset(o)} />{' '}
                {o}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm muted">Sensation tags</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SENSATION_TAGS.map((t) => (
              <button type="button" key={t} onClick={() => toggleTag(t)} className={`px-2 py-1 rounded text-sm ${tags.includes(t) ? 'bg-electricEmerald text-black' : 'bg-[rgba(255,255,255,0.02)]'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm muted">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full mt-2 p-2 rounded bg-[rgba(255,255,255,0.02)]" rows={3} />
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-electricEmerald text-black">Get Triage</button>
          <div className="muted text-sm">Readiness: {readiness ?? '—'}</div>
        </div>
      </form>

      {result && (
        <div className="mt-4">
          <TriageResultCard result={result} />
        </div>
      )}
    </div>
  )
}
