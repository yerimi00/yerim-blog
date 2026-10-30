'use client'

import { motion } from 'motion/react'
import { ease } from '@/components/motion/presets'

// 손으로 그은 듯한 빨간 밑줄. 부모는 position: relative여야 한다. 마운트될 때 왼쪽에서 오른쪽으로 그려진다
export default function HandUnderline({
  delay = 0.1,
  style,
}: {
  delay?: number
  style?: React.CSSProperties
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        left: '-4%',
        width: '108%',
        bottom: '-0.15em',
        height: 'max(7px, 0.4em)',
        overflow: 'visible',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <motion.path
        d="M3 9 C 40 4, 78 12, 118 7 S 178 4, 197 8"
        fill="none"
        stroke="var(--accent)"
        strokeWidth={3.2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, delay, ease: ease.inOut }}
      />
    </svg>
  )
}
