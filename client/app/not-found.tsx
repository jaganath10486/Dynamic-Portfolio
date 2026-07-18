import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 select-none">
          <span className="text-[120px] font-black leading-none tracking-tighter text-slate-800">
            404
          </span>
        </div>

        <div className="mb-8 space-y-3">
          <h1 className="text-xl font-semibold text-slate-200">Page not found</h1>
          <p className="text-sm leading-relaxed text-slate-500">
            The page you are looking for doesn&apos;t exist or has been moved to a different
            location.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/portfolio"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700 px-5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
