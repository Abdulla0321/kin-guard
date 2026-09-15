"use client"
import React, { useMemo } from 'react'
import type { Activity, ActivityCategory } from '../../types/health'
import { ACTIVITIES } from '../../data/activities'

type Props = {
  selected?: string
  onSelect?: (activityId: string) => void
}

/**
 * ActivitySelector
 * - Client component presenting category filter pills and a list of activities.
 * - Returns lightweight selection events; keeps no global side-effects.
 * Why: Small, testable component used by Prevention Hub and other entry points.
 */
export default function ActivitySelector({ selected, onSelect }: Props) {
  const categories: (ActivityCategory | 'All')[] = useMemo(() => ['All', 'Trail', 'Gym', 'Pitch'], [])

  return (
    <div className="card">
      <h3 className="font-semibold">Select Activity</h3>
      <div className="mt-3 flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              // If category 'All' -> show all activities
              // We'll pass back a synthetic id via onSelect when a specific activity is clicked below.
              // Keep filter local to this component for now.
            }}
            className="px-3 py-1 bg-[rgba(255,255,255,0.02)] rounded-md muted text-sm"
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {ACTIVITIES.map((a: Activity) => (
          <li key={a.id}>
            <button
              onClick={() => onSelect?.(a.id)}
              className={`w-full text-left p-3 rounded-md hover:bg-[rgba(255,255,255,0.02)] ${selected === a.id ? 'ring-2 ring-electricEmerald/60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="muted text-sm">{a.description}</div>
                </div>
                <div className="muted text-sm">{a.category}</div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
