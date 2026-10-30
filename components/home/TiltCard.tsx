'use client'

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'

const MAX_TILT = 8
const TILT_SPRING = { stiffness: 260, damping: 22 }

// 마우스 방향으로 기울고 빛이 따라오는 카드. 터치 입력은 무시한다
export default function TiltCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const rotateX = useSpring(0, TILT_SPRING)
  const rotateY = useSpring(0, TILT_SPRING)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 30 })
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 60%)`

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    rotateX.set((0.5 - y) * MAX_TILT * 2)
    rotateY.set((x - 0.5) * MAX_TILT * 2)
    glareX.set(x * 100)
    glareY.set(y * 100)
    glareOpacity.set(1)
  }

  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      style={{ position: 'relative', borderRadius: 'var(--radius-lg)', transformPerspective: 800, rotateX, rotateY, ...style }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="tilt-card"
    >
      {children}
      <motion.span
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', background: glare, opacity: glareOpacity }}
      />
    </motion.div>
  )
}
