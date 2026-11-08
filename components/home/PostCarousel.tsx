'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { Post } from '@/types'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween, spring } from '@/components/motion/presets'

const TONES = ['var(--band)', 'var(--band-2)', 'var(--band-3)']
const CARD_STEP = 340

function Arrow({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      animate={{ backgroundColor: disabled ? 'var(--outline-variant)' : 'var(--text)' }}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      transition={fastTween}
      style={{ width: 40, height: 40, border: 0, borderRadius: 'var(--radius-full)', color: 'var(--bg)', fontSize: '1rem', cursor: disabled ? 'default' : 'pointer' }}
    >
      {children}
    </motion.button>
  )
}

// 최근 글을 옆으로 넘겨 보는 카드 줄. 터치는 네이티브 스크롤, 데스크탑은 화살표로 넘긴다
export default function PostCarousel({ posts, total }: { posts: Post[]; total: number }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const syncEnds = () => {
    const el = listRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  const move = (direction: 1 | -1) => {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    listRef.current?.scrollBy({ left: direction * CARD_STEP, behavior: smooth ? 'smooth' : 'auto' })
  }

  return (
    <section className="home-section">
      <div className="home-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <p className="home-marker">Blog</p>
          <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.65rem)', fontWeight: 700, lineHeight: 1.4, color: 'var(--text)', margin: '0.85rem 0 0' }}>요즘 쓰고 있는 글</h2>
        </div>
        <div className="home-carousel-arrows">
          <Arrow label="이전 글" disabled={atStart} onClick={() => move(-1)}>←</Arrow>
          <Arrow label="다음 글" disabled={atEnd} onClick={() => move(1)}>→</Arrow>
        </div>
      </div>

      <div ref={listRef} className="home-carousel" onScroll={syncEnds}>
        {posts.map((post, i) => (
          <MotionLink
            key={post.id}
            href={`/blog/${post.slug}`}
            className="home-post-card"
            style={{ background: TONES[i % TONES.length] }}
            whileHover={{ y: -4 }}
            transition={spring.soft}
          >
            <span style={{ position: 'relative', fontSize: '0.8rem', fontWeight: 500, color: 'var(--band-muted)' }}>{post.series ?? 'Blog'}</span>
            <strong className="home-post-card-title">{post.title}</strong>
            <span style={{ position: 'relative', fontSize: '0.85rem', fontWeight: 600 }}>읽어 보기 →</span>
          </MotionLink>
        ))}
        <MotionLink
          href="/blog"
          className="home-post-card home-post-card--more"
          whileHover={{ y: -4 }}
          transition={spring.soft}
        >
          <strong style={{ fontSize: '1.1rem', fontWeight: 700 }}>전체 {total}개 글 보기 →</strong>
        </MotionLink>
      </div>
    </section>
  )
}
