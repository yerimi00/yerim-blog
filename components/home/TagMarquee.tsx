'use client'

import { motion } from 'motion/react'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween } from '@/components/motion/presets'

// 같은 묶음을 두 번 놓고 절반만큼 옮겨 끊김 없이 반복한다. 동작 줄이기 설정이면 멈춰 있다
export default function TagMarquee({ tags }: { tags: string[] }) {
  return (
    <nav aria-label="자주 쓰는 태그" className="home-marquee">
      <motion.div
        className="home-marquee-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
      >
        {[false, true].map((isCopy) => (
          <div key={String(isCopy)} className="home-marquee-set" aria-hidden={isCopy || undefined}>
            {tags.map((tag) => (
              <MotionLink
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="home-marquee-item"
                tabIndex={isCopy ? -1 : undefined}
                whileHover={{ color: 'var(--text)' }}
                transition={fastTween}
              >
                {tag}
              </MotionLink>
            ))}
          </div>
        ))}
      </motion.div>
    </nav>
  )
}
