'use client'

import Link from 'next/link'
import { MotionConfig, motion } from 'motion/react'

// OS "동작 줄이기" 설정이면 transform 애니메이션을 끈다 (opacity·색은 유지)
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

// next/link를 motion 컴포넌트로 (whileHover 등 사용)
export const MotionLink = motion.create(Link)
