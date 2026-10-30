'use client'

import { motion } from 'motion/react'
import { fadeUp } from '@/components/motion/presets'

// 화면에 들어오면 아래에서 떠오르며 등장 (한 번만)
export default function SectionReveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      transition={{ delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  )
}
