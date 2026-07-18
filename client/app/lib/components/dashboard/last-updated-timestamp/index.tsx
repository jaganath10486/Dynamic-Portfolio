'use client'

import { memo } from 'react'
import { formatTime } from '@utils/format.utils'
import { Clock } from 'lucide-react'
import './styles.scss'

interface LastUpdatedTimestampProps {
  lastUpdated: Date
  isRefreshing: boolean
}

function LastUpdatedTimestamp({ lastUpdated, isRefreshing }: LastUpdatedTimestampProps) {
  return (
    <div className="lut-wrap">
      {isRefreshing ? (
        <span className="lut-spinner" />
      ) : (
        <Clock size={13} className="lut-icon" />
      )}
      <span className="lut-label" suppressHydrationWarning>
        {isRefreshing ? 'Refreshing…' : `Updated ${formatTime(lastUpdated)}`}
      </span>
    </div>
  )
}

export default memo(LastUpdatedTimestamp)
