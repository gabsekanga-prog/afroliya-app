'use client'

import { useEffect, useRef } from 'react'

import { trackGuidePageView } from '@/lib/guide-stats-client'

type Props = {
  guideId: string
  pagePath: string
}

export function GuidePageStatsTracker({ guideId, pagePath }: Props) {
  const sentRef = useRef(false)

  useEffect(() => {
    if (sentRef.current) return
    sentRef.current = true

    void trackGuidePageView({
      guideId,
      pagePath,
    })
  }, [guideId, pagePath])

  return null
}
