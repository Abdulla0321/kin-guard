"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { WarmupExercise } from '../../types/health'
import { motion, useAnimation } from 'framer-motion'

type Props = {
  exercise: WarmupExercise
}

/**
 * WarmupDrillCard
 * - Supports both time-based and reps-based warmups.
 * - Time mode: shows an animated progress ring using Framer Motion and a simple start/pause reset UX.
 * - Reps mode: shows decrementing reps with completion feedback.
 *
 * Notes on design:
 * - Keep the timer accurate via Date.now difference calculation rather than relying on setInterval drift.
 * - Avoid SSR/DOM assumptions by guarding Date access inside effects.
 */
export default function WarmupDrillCard({ exercise }: Props) {
  const { name, durationSecs, reps, mechanicsNotes, targetMuscles } = exercise
  const isTimeMode = durationSecs > 0

  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(durationSecs)
  const [repsLeft, setRepsLeft] = useState(reps)
  const startRef = useRef<number | null>(null)
  const anim = useAnimation()

  useEffect(() => {
    let raf = 0
    function tick() {
      if (!running || startRef.current == null) return
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000)
      const rem = Math.max(durationSecs - elapsed, 0)
      setRemaining(rem)
      if (rem <= 0) setRunning(false)
      raf = requestAnimationFrame(tick)
    }
    if (running) raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  useEffect(() => {
    // drive a subtle animation when running
    anim.start({ rotate: running ? 360 : 0, transition: { repeat: running ? Infinity : 0, duration: 6 } })
  }, [running, anim])

  const pct = useMemo(() => {
    if (!isTimeMode) return 0
    return ((durationSecs - remaining) / Math.max(durationSecs, 1)) * 100
  }, [durationSecs, remaining, isTimeMode])

  const handleStart = () => {
    if (!isTimeMode) return
    if (!running) {
      // start counting from now; if paused, adjust startRef to account for elapsed
      startRef.current = Date.now() - (durationSecs - remaining) * 1000
      setRunning(true)
    }
  }

  const handlePause = () => setRunning(false)
  const handleReset = () => {
    setRunning(false)
    setRemaining(durationSecs)
    setRepsLeft(reps)
    startRef.current = null
  }

  return (
    <div className="card flex items-center gap-4">
      <div className="w-20 h-20 flex items-center justify-center">
        <motion.div animate={anim}>
          <svg viewBox="0 0 36 36" className="w-16 h-16">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <path d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831" fill="none" stroke="#0f1724" strokeWidth="2" />
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: pct / 100 }}
            d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831"
            stroke="url(#g1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          </svg>
        </motion.div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-medium">{name}</div>
            <div className="muted text-sm">{mechanicsNotes}</div>
            <div className="muted text-xs mt-1">Targets: {targetMuscles.join(', ')}</div>
          </div>
          <div className="text-right">
            {isTimeMode ? (
              <div className="font-semibold">{remaining}s</div>
            ) : (
              <div className="font-semibold">{repsLeft} reps</div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {isTimeMode ? (
            <>
              <button onClick={handleStart} className="px-3 py-1 rounded bg-electricEmerald text-black">Start</button>
              <button onClick={handlePause} className="px-3 py-1 rounded bg-[rgba(255,255,255,0.04)]">Pause</button>
              <button onClick={handleReset} className="px-3 py-1 rounded muted">Reset</button>
            </>
          ) : (
            <>
              <button onClick={() => setRepsLeft((r) => Math.max(0, r - 1))} className="px-3 py-1 rounded bg-electricEmerald text-black">Done rep</button>
              <button onClick={() => setRepsLeft((r) => r + 1)} className="px-3 py-1 rounded bg-[rgba(255,255,255,0.04)]">+1</button>
              <button onClick={handleReset} className="px-3 py-1 rounded muted">Reset</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
