'use client'

import { motion } from 'motion/react'

// 타이핑 커서 깜빡임
export default function BlinkCursor({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.span
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'text-bottom', ...style }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.7, times: [0, 0.5, 0.5, 1], repeat: Infinity }}
    />
  )
}
