export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPct(value: number | null | undefined, showSign = true): string {
  if (value === null || value === undefined) return '—'
  const sign = showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
