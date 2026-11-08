'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import type { Post } from '@/types'
import { fastTween, spring } from '@/components/motion/presets'
import { formatDate, seriesColor, toYYMM } from '@/lib/utils'

// 왼쪽은 고른 글의 소개, 오른쪽은 목록. 마우스·키보드로 목록을 고르면 왼쪽이 바뀐다. 터치 화면은 최신 글을 크게 보여준다
export default function PostShowcase({ posts, total }: { posts: Post[]; total: number }) {
  const [active, setActive] = useState(0)
  const lead = posts[active]
  if (!lead) return null

  return (
    <section className="home-section">
      <div className="home-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <p className="home-marker">Blog</p>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.45, color: 'var(--text)', margin: '0.85rem 0 0' }}>요즘 쓰고 있는 글</h2>
          </div>
          <Link href="/blog" style={{ flexShrink: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>전체 {total}개 →</Link>
        </div>

        <div className="home-showcase">
          <Link href={`/blog/${lead.slug}`} className="home-showcase-lead">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={lead.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.16 }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
                  {lead.series && <span style={{ fontWeight: 600, color: seriesColor(lead.series) }}>{lead.series} · </span>}
                  {formatDate(lead.date)}
                </p>
                <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.35, color: 'var(--text)', margin: '0 0 0.9rem' }}>
                  {lead.title}
                </h3>
                <p className="home-showcase-desc">{lead.description}</p>
                <span style={{ marginTop: 'auto', paddingTop: '1.25rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent)' }}>읽어 보기 →</span>
              </motion.div>
            </AnimatePresence>
          </Link>

          <ul className="home-showcase-list">
            {posts.map((post, i) => (
              <li key={post.id} className="home-showcase-item" style={{ position: 'relative' }}>
                {i === active && <motion.span layoutId="home-showcase-bar" className="home-showcase-bar" transition={spring.soft} />}
                <Link
                  href={`/blog/${post.slug}`}
                  className="home-showcase-row"
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setActive(i)
                  }}
                  onFocus={() => setActive(i)}
                >
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{toYYMM(post.date)}</span>
                  <motion.span
                    className="home-showcase-title"
                    initial={false}
                    animate={{ color: i === active ? 'var(--text)' : 'var(--text-secondary)', x: i === active ? 4 : 0 }}
                    transition={fastTween}
                  >
                    {post.title}
                  </motion.span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
