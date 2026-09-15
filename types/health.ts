/**
 * Domain models for KineticGuard
 * These types live in a centralized module so UI, mock data and business logic
 * can depend on a single source of truth. Keep them explicit and minimal.
 */

// Activity category union keeps it simple and easy to extend
export type ActivityCategory = 'Trail' | 'Gym' | 'Pitch'

export interface WarmupExercise {
  id: string
  name: string
  // duration in seconds when the exercise is time-based; 0 if reps-driven
  durationSecs: number
  // number of reps; 0 if time-driven
  reps: number
  // primary targeted muscle groups (informational UI + risk mapping)
  targetMuscles: string[]
  // short coaching notes to display during warm-up
  mechanicsNotes?: string
}

export interface ClinicalRisk {
  id: string
  condition: string
  // 0-100 conservative severity score for prioritization/visualization
  severityScore: number
  // high-level mechanism e.g. 'inversion', 'overuse', 'contact'
  mechanism: string
  // possible clinical outcome to show to users (kept conservative / educational)
  clinicalOutcome: string
}

export interface Activity {
  id: string
  title: string
  category: ActivityCategory
  description?: string
  // dynamic warm-up sequence
  warmups: WarmupExercise[]
  // simple checklist of essential gear
  gearChecklist: string[]
  // clinical risks associated with the activity
  risks: ClinicalRisk[]
}

// Symptom reporting types used by the triage system
export type PainScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type OnsetType = 'acute' | 'gradual' | 'delayed'

export type SensationTag = 'sharp' | 'burning' | 'dull' | 'tingling' | 'numbness' | 'pop' | 'click'

export interface SymptomReport {
  activityId?: string
  zone: string // e.g. 'right ankle', 'left shoulder', 'central head'
  pain: PainScale
  onset: OnsetType
  tags: SensationTag[]
  notes?: string
}

export interface TriageResult {
  urgent: boolean
  reason: string[]
  // short conservative recommendation for first-aid / next steps
  recommendation: string
  // optional referral note for clinician escalation
  referToClinician?: boolean
}
