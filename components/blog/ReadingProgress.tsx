'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <motion.div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      initial={false}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.08, ease: 'linear' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: 'var(--accent)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}
