"use client"
import React, { useState } from 'react'

/**
 * Persistent clinical disclaimer badge and modal.
 * - The badge is always visible in the bottom-left corner.
 * - Users can open the modal to read the full disclaimer; the badge remains.
 */
export default function Disclaimer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50">
        <button onClick={() => setOpen(true)} className="px-3 py-2 rounded bg-[rgba(255,255,255,0.04)] text-sm">
          Clinical Disclaimer
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl p-6 bg-surface rounded">
            <h2 className="text-lg font-semibold">Clinical Disclaimer</h2>
            <p className="mt-3 muted text-sm">
              KineticGuard provides conservative, educational guidance and triage support only. This tool does not diagnose or replace a clinical assessment.
              For worsening symptoms, suspected fractures, head injury, loss of consciousness, or signs of systemic illness, seek urgent medical care.
            </p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-electricEmerald text-black">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
