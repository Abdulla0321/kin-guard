import type { SymptomReport, TriageResult } from '../types/health'

// Conservative, client-side triage engine.
// Purpose: provide immediate, evidence-informed safety guidance and red-flag detection
// for the SymptomIntakeForm. This is NOT diagnostic and always errs on the side of
// escalation. Keep rules explicit, testable, and easy to extend.

export function evaluateTriage(report: SymptomReport): TriageResult {
  const reasons: string[] = []
  let urgent = false
  let referToClinician = false

  const zone = (report.zone || '').toLowerCase()
  const notes = (report.notes || '').toLowerCase()

  // Rule: Severe pain
  if (report.pain >= 8) {
    urgent = true
    reasons.push('Severe pain (≥8/10) — may indicate major tissue injury')
  }

  // Rule: Audible pop, acute onset + pop -> possible rupture
  if (report.onset === 'acute' && report.tags.includes('pop')) {
    urgent = true
    reasons.push('Audible pop at time of injury — possible structural rupture')
  }

  // Rule: Neurological signs
  if (report.tags.includes('numbness') || report.tags.includes('tingling')) {
    urgent = true
    referToClinician = true
    reasons.push('Neurological symptoms (numbness/tingling) — consider urgent assessment')
  }

  // Rule: Visible deformity / locked joint keywords in notes
  if (/deform|deformed|visible deform|cannot move|locked|buckle/i.test(notes)) {
    urgent = true
    referToClinician = true
    reasons.push('Possible visible deformity or mechanical block/locked joint')
  }

  // Rule: Head injury / concussion indicators
  if (zone.includes('head') || zone.includes('face') || notes.includes('loss of consciousness') || notes.includes('confus')) {
    urgent = true
    referToClinician = true
    reasons.push('Head/face injury or altered conscious state — follow concussion/remove-from-play protocol')
  }

  // Rule: High-risk zones with significant pain (knee with instability, etc.)
  if (zone.includes('knee') && (report.pain >= 7 || notes.includes('unstable') || notes.includes('giving way'))) {
    urgent = true
    reasons.push('Knee pain with instability — possible ligament injury')
  }

  // If no explicit urgent flags, provide conservative first-aid guidance
  let recommendation = ''
  if (urgent) {
    recommendation = `Stop activity. Protect and immobilize the area as needed. Seek urgent clinical assessment or emergency care if symptoms worsen. Apply short-term P.O.L.I.C.E. (Protection, Optimal Loading, Ice, Compression, Elevation) measures and avoid aggressive loading until cleared.`
  } else {
    recommendation = `Conservative first aid: P.O.L.I.C.E. / R.I.C.E. for acute symptoms (48–72 hours), gradual re-introduction of controlled loading, monitor for deterioration (increasing pain, swelling, numbness, loss of function). If symptoms persist beyond 72 hours or worsen, seek clinical evaluation.`
  }

  // Always include a safety disclaimer at the engine level
  recommendation += '\n\nDisclaimer: This tool provides conservative guidance only and does not replace a medical assessment.'

  return {
    urgent,
    reason: reasons.length > 0 ? reasons : ['No immediate red flags detected.'],
    recommendation,
    referToClinician: referToClinician || urgent
  } as TriageResult
}
