'use client'

import { useEffect } from 'react'

interface GoogleAdsenseProps {
  slot: string
  className?: string
  style?: React.CSSProperties
}

export default function GoogleAdsense({ slot, className, style }: GoogleAdsenseProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  if (!publisherId) return null

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
