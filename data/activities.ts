import type { Activity } from '../types/health'

// Lightweight id generator to avoid extra runtime dependencies in the mock dataset.
// Produces short, human-readable ids suitable for mock data and UI keys.
function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Mock dataset for three activity profiles.
 * Keep the data descriptive enough to power the Prevention Hub UI and
 * to exercise the risk engine later.
 */

const trailRunning: Activity = {
  id: 'trail-running',
  title: 'Trail Running',
  category: 'Trail',
  description: 'Off-road running with variable terrain — emphasis on balance, ankle prep and hydration.',
  warmups: [
    {
      id: 'tr-ankle-circles',
      name: 'Ankle Circles',
      durationSecs: 30,
      reps: 0,
      targetMuscles: ['ankle stabilizers', 'peroneals'],
      mechanicsNotes: 'Slow, controlled circles each direction; aim for full ROM.'
    },
    {
      id: 'tr-lateral-hops',
      name: 'Lateral Single-Leg Hops',
      durationSecs: 0,
      reps: 10,
      targetMuscles: ['calf', 'peroneals', 'glute medius'],
      mechanicsNotes: 'Soft landings, absorb with knee and ankle.'
    },
    {
      id: 'tr-dynamic-lunge',
      name: 'Walking Lunges with Twist',
      durationSecs: 0,
      reps: 12,
      targetMuscles: ['quads', 'glutes', 'hip flexors'],
      mechanicsNotes: 'Keep torso tall; rotate towards leading leg.'
    }
  ],
  gearChecklist: ['Trail shoes', 'Hydration pack', 'Phone/ID', 'Headlamp (if low light)'],
  risks: [
    {
      id: generateId('risk'),
      condition: 'Ankle inversion sprain',
      severityScore: 60,
      mechanism: 'single-leg misstep on uneven terrain',
      clinicalOutcome: 'Acute lateral ankle ligament injury; swelling, instability, and pain on weightbearing.'
    },
    {
      id: generateId('risk'),
      condition: 'Iliotibial band syndrome (ITBS)',
      severityScore: 40,
      mechanism: 'repetitive friction at lateral knee',
      clinicalOutcome: 'Lateral knee pain with downhill running and increased mileage.'
    }
  ]
}

const bouldering: Activity = {
  id: 'bouldering',
  title: 'Bouldering / Sport Climbing',
  category: 'Gym',
  description: 'High-intensity climbing focusing on grip, finger pulley safety, and shoulder mechanics.',
  warmups: [
    {
      id: 'climb-shoulder-circles',
      name: 'Shoulder Rolls & Band Pull-Aparts',
      durationSecs: 60,
      reps: 0,
      targetMuscles: ['rotator cuff', 'scapular stabilizers'],
      mechanicsNotes: 'Control motion; prioritize scapular retraction.'
    },
    {
      id: 'climb-finger-warm',
      name: 'Finger Extensor Band Warm',
      durationSecs: 45,
      reps: 0,
      targetMuscles: ['finger extensors', 'forearm'],
      mechanicsNotes: 'Gentle extension against band tension; avoid pain.'
    },
    {
      id: 'climb-core-brace',
      name: 'Dead Bug Core Activation',
      durationSecs: 0,
      reps: 10,
      targetMuscles: ['local core', 'transverse abdominis'],
      mechanicsNotes: 'Slow, deliberate, maintain neutral spine.'
    }
  ],
  gearChecklist: ['Chalk bag', 'Climbing shoes', 'Tape for fingers', 'Crash pad (for outdoor bouldering)'],
  risks: [
    {
      id: generateId('risk'),
      condition: 'A2 pulley strain',
      severityScore: 55,
      mechanism: 'rapid crimping / high load to flexor tendon sheath',
      clinicalOutcome: 'Pain at the volar finger with swelling; reduced grip strength.'
    },
    {
      id: generateId('risk'),
      condition: 'Rotator cuff tendinopathy / impingement',
      severityScore: 45,
      mechanism: 'repetitive overhead reaches and poor scapular control',
      clinicalOutcome: 'Anterior/lateral shoulder pain while reaching; weakness with overhead moves.'
    }
  ]
}

const football: Activity = {
  id: 'football',
  title: 'Football / Soccer',
  category: 'Pitch',
  description: 'Field sport with cutting, tackling and high-speed deceleration demands.',
  warmups: [
    {
      id: 'fb-hamstring-swing',
      name: 'Leg Swings (Forward & Lateral)',
      durationSecs: 30,
      reps: 0,
      targetMuscles: ['hamstrings', 'hip flexors'],
      mechanicsNotes: 'Controlled tempo; use a wall for balance.'
    },
    {
      id: 'fb-glute-bridge',
      name: 'Single-Leg Glute Bridge',
      durationSecs: 0,
      reps: 12,
      targetMuscles: ['glutes', 'hamstrings'],
      mechanicsNotes: 'Drive through heel; avoid lumbar extension.'
    },
    {
      id: 'fb-landing-drill',
      name: 'Drop-to-Sprint (Eccentric control)',
      durationSecs: 0,
      reps: 6,
      targetMuscles: ['quads', 'glutes'],
      mechanicsNotes: 'Soft landing, immediate acceleration; focus on knee alignment.'
    }
  ],
  gearChecklist: ['Shin guards', 'Proper boots', 'Mouthguard (if used)', 'Hydration'],
  risks: [
    {
      id: generateId('risk'),
      condition: 'ACL rupture (risk reduction focus)',
      severityScore: 80,
      mechanism: 'non-contact pivoting with valgus collapse',
      clinicalOutcome: 'Acute knee instability, audible pop, and inability to continue running.'
    },
    {
      id: generateId('risk'),
      condition: 'Concussion',
      severityScore: 85,
      mechanism: 'direct blow to head or force transmission',
      clinicalOutcome: 'Loss of consciousness, confusion, headache; immediate removal from play.'
    }
  ]
}

export const ACTIVITIES: Activity[] = [trailRunning, bouldering, football]

export default ACTIVITIES
