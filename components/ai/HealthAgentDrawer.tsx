"use client"

import React, { useState } from 'react'
import { useChat } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import { MessageSquare, Send, Sparkles, X, RotateCcw } from 'lucide-react'

const quickActions = [
  'Mid-run calf cramp',
  'Shoulder impingement during swim',
  'Knee click with swelling'
]

export default function HealthAgentDrawer() {
  const [open, setOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append, status, error } = useChat({
    api: '/api/chat'
  })

  const resetChat = () => setMessages([])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-electricEmerald text-lg shadow-lg shadow-electricEmerald/30 transition hover:scale-105"
        aria-label="Toggle health assistant"
      >
        <MessageSquare className="h-6 w-6 text-slate-950" />
      </button>

      <div
        className={`fixed right-4 bottom-4 z-50 w-[min(420px,calc(100vw-1.5rem))] rounded-2xl border border-white/10 bg-slate-900/95 text-slate-100 shadow-2xl transition-transform duration-200 ${
          open ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-electricEmerald" />
            <div className="font-medium">KineticGuard AI</div>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="rounded p-1 hover:bg-white/5" aria-label="Close drawer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => append({ role: 'user', content: prompt })}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200 transition hover:bg-white/10"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-4 max-h-[360px] min-h-[180px] space-y-3 overflow-y-auto rounded-xl bg-black/10 p-3">
            {messages.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/10 p-3 text-sm text-slate-300">
                Ask for immediate triage guidance, symptom assessment, or return-to-play criteria.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-xl p-3 text-sm ${
                    message.role === 'user' ? 'ml-6 bg-electricEmerald/15 text-slate-100' : 'mr-6 bg-slate-800/80 text-slate-100'
                  }`}
                >
                  <ReactMarkdown className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-6">
                    {message.content}
                  </ReactMarkdown>
                </div>
              ))
            )}
            {isLoading && (
              <div className="mr-6 rounded-xl bg-slate-800/80 p-3 text-xs text-slate-300">
                {status === 'streaming' ? 'Streaming safety guidance…' : 'Thinking…'}
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-dangerAlert/40 bg-dangerAlert/10 p-3 text-xs text-red-200">
                The assistant could not respond right now. Please try again in a moment.
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!input.trim()) return
              handleSubmit(event)
            }}
            className="mt-4 flex gap-2"
          >
            <input
              value={input}
              onChange={handleInputChange}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-50 outline-none placeholder:text-slate-400"
              placeholder="Describe soreness, swelling, or pain…"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-xl bg-electricEmerald px-3 py-2 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
              {status === 'streaming' ? 'Streaming' : isLoading ? 'Thinking' : 'Ready'}
            </div>
            <button type="button" onClick={resetChat} className="inline-flex items-center gap-1 rounded border border-white/10 px-2 py-1 text-xs text-slate-300 hover:bg-white/5">
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
