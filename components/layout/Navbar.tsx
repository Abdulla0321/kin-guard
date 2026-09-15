"use client"
import React, { useState } from 'react'

/**
 * Simple Navbar client component.
 * Why: Keeps interactive UI (theme toggle, drawer triggers) on client side.
 * State: small local `theme` state for demo; in production we sync to a context/store.
 */
export default function Navbar(): React.ReactElement {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark((v) => !v)
    // In a full app, we'd add/remove `class='dark'` on <html> and persist to localStorage
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', !isDark)
    }
  }

  return (
    <header className="w-full border-b border-[rgba(255,255,255,0.04)]">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full w-10 h-10 flex items-center justify-center bg-electricEmerald text-black font-bold">KG</div>
          <div>
            <div className="font-semibold">KineticGuard</div>
            <div className="muted text-sm">Proactive sports medicine</div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <button className="px-3 py-1 rounded-md muted">Prevent</button>
          <button className="px-3 py-1 rounded-md muted">Triage</button>
          <button className="px-3 py-1 rounded-md muted">AI Assist</button>
          <button onClick={toggleTheme} aria-label="Toggle theme" className="ml-2 px-3 py-1 rounded bg-[rgba(255,255,255,0.04)]">
            {isDark ? 'Dark' : 'Light'}
          </button>
        </nav>
      </div>
    </header>
  )
}
