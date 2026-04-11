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
        {tags.map((tag) => (
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
          </button>
        ))}
      </div>

      {/* 글 목록 */}
      <div>
        {filtered.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
            해당 태그의 글이 없어요.
          </p>
        ) : (
          filtered.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
        )}
      </div>
    </div>
  )
}
