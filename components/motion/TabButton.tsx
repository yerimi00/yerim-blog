'use client'

import { motion } from 'motion/react'
import HandUnderline from '@/components/motion/HandUnderline'
import { fastTween } from '@/components/motion/presets'

// 시리즈·카테고리 탭. 활성 탭은 손그림 밑줄이 그려진다
export default function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <motion.button
      type="button"
      className="series-tab-btn"
      aria-pressed={active}
      onClick={onClick}
      initial={false}
      animate={{ color: active ? 'var(--text)' : 'var(--text-muted)' }}
      whileHover={active ? undefined : { color: 'var(--text)' }}
      transition={fastTween}
      style={{ position: 'relative', fontWeight: active ? 700 : 500 }}
    >
      {children}
      {active && <HandUnderline style={{ left: '12%', width: '76%', bottom: 2, height: 7 }} />}
    </motion.button>
  )
}
