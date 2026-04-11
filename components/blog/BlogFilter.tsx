'use client'

import { useState } from 'react'
import { Post } from '@/types'
import PostCard from './PostCard'

export default function BlogFilter({ tags, posts }: { tags: string[]; posts: Post[] }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const filtered = selectedTag
    ? posts.filter((p) => p.tags.includes(selectedTag))
    : posts

  return (
    <div>
      {/* 태그 필터 바 */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button
          onClick={() => setSelectedTag(null)}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: !selectedTag ? 'var(--accent)' : 'transparent',
            color: !selectedTag ? '#fff' : 'var(--text-muted)',
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          전체
        </button>
        {tags.map((tag) => {
          const count = posts.filter((p) => p.tags.includes(tag)).length
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                background: selectedTag === tag ? 'var(--accent)' : 'transparent',
                color: selectedTag === tag ? '#fff' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tag}
              <span style={{ marginLeft: '5px', opacity: 0.65, fontSize: '0.75rem' }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* 글 목록 (연도별 그룹핑) */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
          해당 태그의 글이 없어요.
        </p>
      ) : (() => {
        const grouped = filtered.reduce<Record<string, Post[]>>((acc, post) => {
          const year = new Date(post.date).getFullYear().toString()
          if (!acc[year]) acc[year] = []
          acc[year].push(post)
          return acc
        }, {})
        const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))
        let globalIndex = 0
        return years.map((year) => (
          <div key={year}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace',
                padding: '1.25rem 0 0.5rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              {year}
            </p>
            {grouped[year].map((post) => (
              <PostCard key={post.id} post={post} index={globalIndex++} />
            ))}
          </div>
        ))
      })()}
    </div>
  )
}
