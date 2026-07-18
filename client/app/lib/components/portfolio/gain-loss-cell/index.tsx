'use client'

import { memo } from 'react'
import { formatCurrency, formatPct } from '@utils/format.utils'
import './styles.scss'

interface GainLossCellProps {
  value: number | null
  pct: number | null
}

function GainLossCell({ value, pct }: GainLossCellProps) {
  if (value === null && pct === null) {
    return <span className="glc-null">—</span>
  }

  const isPositive = (value ?? 0) >= 0

  return (
    <div className={`glc-wrap${isPositive ? ' glc-wrap--positive' : ' glc-wrap--negative'}`}>
      <span className="glc-arrow">{isPositive ? '▲' : '▼'}</span>
      <div className="glc-values">
        <span className="glc-abs">{formatCurrency(value)}</span>
        <span className="glc-pct">{formatPct(pct)}</span>
      </div>
    </div>
  )
}

export default memo(GainLossCell)
