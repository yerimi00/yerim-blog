'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import type { Post } from '@/types'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween } from '@/components/motion/presets'
import { toYYMM } from '@/lib/utils'
import { ArrowRight } from '@/components/ui/text-arrows'

const titleVariants = { rest: { color: 'var(--text)' }, hover: { color: 'var(--accent)' } }
const arrowVariants = { rest: { opacity: 0, x: -4 }, hover: { opacity: 1, x: 0 } }

// 제목이 길어도 잘리지 않게 전체 폭 목록으로 보여준다
export default function RecentPosts({ posts, total }: { posts: Post[]; total: number }) {
  return (
    <section className="home-section">
      <div className="home-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <p className="home-marker">Blog</p>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.45, color: 'var(--text)', margin: '0.85rem 0 0' }}>요즘 쓰고 있는 글</h2>
          </div>
          <Link href="/blog" style={{ flexShrink: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>전체 {total}개 <ArrowRight /></Link>
        </div>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {posts.map((post) => (
            <li key={post.id}>
              <MotionLink href={`/blog/${post.slug}`} className="home-post-row" initial="rest" animate="rest" whileHover="hover">
                <span style={{ gridArea: 'date', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{toYYMM(post.date)}</span>
                <span style={{ gridArea: 'body', minWidth: 0 }}>
                  <motion.strong
                    variants={titleVariants}
                    transition={fastTween}
                    style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.5 }}
                  >
                    {post.title}
                  </motion.strong>
                  {post.description && (
                    <span style={{ display: 'block', marginTop: '0.35rem', fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{post.description}</span>
                  )}
                </span>
                <motion.span className="home-post-arrow" variants={arrowVariants} transition={fastTween}><ArrowRight /></motion.span>
              </MotionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
