'use client'

import { motion } from 'motion/react'
import { ease } from '@/components/motion/presets'

// 강조색 직선 밑줄. 부모는 position: relative여야 한다. 마운트될 때 왼쪽에서 오른쪽으로 그어진다
export default function Underline({
  delay = 0,
  style,
}: {
  delay?: number
  style?: React.CSSProperties
}) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.3, delay, ease: ease.out }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -4,
        height: 2,
        background: 'var(--accent)',
        transformOrigin: 'left center',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
