'use client'

import { motion } from 'motion/react'

// 로딩 스켈레톤. 반짝이는 그라데이션 이동을 JS로 돌린다
export default function Skeleton({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return (
    <motion.div
      className={`skeleton${className ? ` ${className}` : ''}`}
      style={style}
      initial={{ backgroundPosition: '200% 0' }}
      animate={{ backgroundPosition: '-200% 0' }}
      transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
    />
  )
}
