'use client'

import { useState } from 'react'
import { Post } from '@/types'
import PostCard from './PostCard'

export default function BlogFilter({ series, posts, commentCounts = {} }: { series: string[]; posts: Post[]; commentCounts?: Record<string, number> }) {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null)

  const filtered = selectedSeries
    ? posts.filter((p) => p.series === selectedSeries)
    : posts

  const allTabs = ['전체', ...series]

  return (
    <div>
      {/* 시리즈 탭 필터 */}
      <div
        style={{
          display: 'flex',
          gap: '0',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--border)',
          marginBottom: '0',
        }}
      >
        {allTabs.map((tab) => {
          const isActive = tab === '전체' ? !selectedSeries : selectedSeries === tab
          return (
            <button
              key={tab}
              onClick={() => setSelectedSeries(tab === '전체' ? null : tab === selectedSeries ? null : tab)}
              style={{
                padding: '0.6rem 1rem',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--text)' : '2px solid transparent',
                background: 'transparent',
                color: isActive ? 'var(--text)' : 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                marginBottom: '-1px',
                fontFamily: 'inherit',
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* 글 목록 */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
          해당 시리즈의 글이 없어요.
        </p>
      ) : (
        <div>
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} commentCount={commentCounts[post.slug] ?? 0} />
          ))}
        </div>
      )}
    </div>
  )
}
