'use client'

import { useEffect, useState } from 'react'
import BlinkCursor from '@/components/motion/BlinkCursor'

export default function TypewriterText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span style={style}>
      {displayed}
      {!done && <BlinkCursor style={{ width: '2px', height: '1em', background: 'var(--text)', marginLeft: '2px' }} />}
    </span>
  )
}
