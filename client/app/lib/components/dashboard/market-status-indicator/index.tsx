'use client'

import { memo } from 'react'
import './styles.scss'

interface MarketStatusIndicatorProps {
  isOpen: boolean
}

function MarketStatusIndicator({ isOpen }: MarketStatusIndicatorProps) {
  return (
    <div className={`msi-wrap${isOpen ? ' msi-wrap--open' : ' msi-wrap--closed'}`}>
      <span className="msi-dot" />
      <span className="msi-label">NSE {isOpen ? 'Open' : 'Closed'}</span>
    </div>
  )
}

export default memo(MarketStatusIndicator)
