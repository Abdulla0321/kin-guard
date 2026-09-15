import './globals.css'
import React from 'react'

export const metadata = {
  title: 'KineticGuard',
  description: 'Proactive sports medicine & injury prevention'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-shell">
        {children}
      </body>
    </html>
  )
}

/*
  Why: This root layout is intentionally minimal. It imports the global
  styles and provides a single top-level `app-shell` so child pages/components
  can rely on consistent full-height layout and theming.

  Edge cases: Avoid heavy client-side logic here to keep first render
  static and compatible with Next's server rendering.
*/
