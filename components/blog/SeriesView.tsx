'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import SeriesList from './SeriesList'
import { HiBars3, HiOutlineSquares2X2 } from 'react-icons/hi2'

function SeriesGridCard({ seriesName, posts }: { seriesName: string; posts: Post[] }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>📁</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {seriesName}
        </span>
        <span
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '1px 8px',
            flexShrink: 0,
          }}
        >
          {posts.length}편
        </span>
      </div>

      {/* 포스트 목록 */}
      <div style={{ flex: 1 }}>
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              className="series-item"
              style={{
                padding: '0.7rem 1.25rem',
                borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
                background: 'transparent',
                transition: 'background 0.15s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginTop: '0.2rem',
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text)',
                    margin: 0,
                    lineHeight: 1.45,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {post.title}
                </p>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {formatDate(post.date)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function SeriesView({ seriesEntries }: { seriesEntries: [string, Post[]][] }) {
  const [view, setView] = useState<'list' | 'grid'>('list')

  const btnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontSize: '1rem',
  })

  return (
    <div>
      {/* 뷰 전환 토글 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <button style={btnStyle(view === 'list')} onClick={() => setView('list')} title="리스트 뷰">
          <HiBars3 />
        </button>
        <button style={btnStyle(view === 'grid')} onClick={() => setView('grid')} title="그리드 뷰">
          <HiOutlineSquares2X2 />
        </button>
      </div>

      {view === 'list' ? (
        <SeriesList seriesEntries={seriesEntries} />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {seriesEntries.map(([seriesName, posts]) => (
            <SeriesGridCard key={seriesName} seriesName={seriesName} posts={posts} />
          ))}
        </div>
      )}
    </div>
  )
}
