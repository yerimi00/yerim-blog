'use client'

import { motion } from 'motion/react'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween } from '@/components/motion/presets'
import { Post } from '@/types'

function SeriesGridCard({ seriesName, posts }: { seriesName: string; posts: Post[] }) {
  return (
    <MotionLink
      href={`/blog/series/${encodeURIComponent(seriesName)}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
      whileHover={{ opacity: 0.75 }}
      transition={fastTween}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/folder.png"
        alt={seriesName}
        style={{ width: '96px', height: 'auto' }}
        whileHover={{ y: -4 }}
        transition={fastTween}
      />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
          {seriesName}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {posts.length === 0 ? '모음집' : `${posts.length}편`}
        </div>
      </div>
    </MotionLink>
  )
}

export default function SeriesView({ seriesEntries }: { seriesEntries: [string, Post[]][] }) {
  return (
    <div className="series-folder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem 0.5rem' }}>
      {seriesEntries.map(([seriesName, posts]) => (
        <SeriesGridCard key={seriesName} seriesName={seriesName} posts={posts} />
      ))}
    </div>
  )
}
