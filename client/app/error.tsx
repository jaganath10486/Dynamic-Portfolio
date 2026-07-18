'use client'

import { useEffect } from 'react'
import Button from '@ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Runtime Error', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
        </div>

        <div className="mb-8 space-y-3">
          <h1 className="text-xl font-semibold text-slate-200">Something went wrong</h1>
          <p className="text-sm leading-relaxed text-slate-500">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-slate-700">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Try again
          </Button>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700 px-5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
