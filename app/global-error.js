'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
          <div className="max-w-md p-8 bg-card rounded-lg shadow-lg text-center">
            <h1 className="text-4xl font-bold mb-4 text-primary">Oops! Something went wrong</h1>
            <p className="text-xl mb-6 text-muted-foreground">
              We're sorry, but we've encountered an unexpected error.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors duration-200 font-semibold"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}