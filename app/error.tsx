// app/error.tsx
'use client'

import React from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
          <div className="max-w-md p-8 bg-card rounded-lg shadow-lg text-center">
            <h1 className="text-4xl font-bold mb-4 text-primary">Whoops! We've Hit a Snag</h1>
            <p className="text-xl mb-6 text-muted-foreground">
              Even AI assistants stumble sometimes. Let's dust ourselves off and try again!
            </p>
            <p className="text-sm mb-6 text-muted-foreground">
              Error: {error.message}
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors duration-200 font-semibold"
            >
              Let's Give It Another Shot
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}