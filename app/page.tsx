"use client"
import React, { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import ActivitySelector from '../components/prevention/ActivitySelector'
import WarmupDrillCard from '../components/prevention/WarmupDrillCard'
import RiskAnalysisCard from '../components/prevention/RiskAnalysisCard'
import GearChecklist from '../components/prevention/GearChecklist'
import HealthAgentDrawer from '../components/ai/HealthAgentDrawer'
import { ACTIVITIES } from '../data/activities'

export default function Page() {
  const [selected, setSelected] = useState<string | undefined>(ACTIVITIES[0]?.id)
  const activity = ACTIVITIES.find((a) => a.id === selected) ?? ACTIVITIES[0]

  return (
    <div>
      <Navbar />
      <main className="container mt-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <ActivitySelector selected={selected} onSelect={(id) => setSelected(id)} />

            <div className="card">
              <h2 className="text-lg font-semibold">Warm-up</h2>
              <p className="muted text-sm">Follow the suggested drills before starting.</p>

              <div className="mt-4 space-y-3">
                {activity.warmups.map((w) => (
                  <WarmupDrillCard key={w.id} exercise={w} />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <RiskAnalysisCard activity={activity} />
            <GearChecklist items={activity.gearChecklist} />
          </aside>
        </section>
      </main>
      <HealthAgentDrawer />
    </div>
  )
}

/*
  Why: Basic, responsive dashboard shell using Tailwind grid.
  The layout separates a primary content area and a right-hand quick-actions panel.
  Keep this server component minimal; interactivity will be handled in client components.
*/
