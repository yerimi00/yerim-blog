'use client'

import { motion } from 'motion/react'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween } from '@/components/motion/presets'

type LinkProps = React.ComponentProps<typeof MotionLink>

// 호버하면 배경이 살짝 진해지는 카드 링크 (서버 컴포넌트에서도 쓸 수 있게 분리)
export function HoverCardLink(props: LinkProps) {
  return (
    <MotionLink
      whileHover={{ backgroundColor: 'var(--surface-container)' }}
      transition={fastTween}
      {...props}
    />
  )
}

// 호버하면 흐려지는 행
export function HoverFade({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div whileHover={{ opacity: 0.65 }} transition={fastTween} style={style}>
      {children}
    </motion.div>
  )
}
