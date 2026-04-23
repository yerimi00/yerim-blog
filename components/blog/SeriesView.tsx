'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import SeriesList from './SeriesList'
import { HiBars3, HiOutlineSquares2X2 } from 'react-icons/hi2'

const FOLDER_COLORS = ['#E8EFFF', '#E8EFFF', '#F2F2F2', '#EAEAEA']

function FileShape({ opacity = 1 }: { opacity?: number }) {
  return (
    <svg width="64" height="80" viewBox="0 0 64 80" style={{ display: 'block', opacity }}>
      <path d="M0,0 L46,0 L64,18 L64,80 L0,80 Z" fill="rgba(255,255,255,0.9)" />
      <path d="M46,0 L46,18 L64,18 Z" fill="rgba(0,0,0,0.08)" />
      <rect x="9" y="30" width="32" height="3.5" rx="1.75" fill="rgba(0,0,0,0.08)" />
      <rect x="9" y="39" width="26" height="3.5" rx="1.75" fill="rgba(0,0,0,0.06)" />
      <rect x="9" y="48" width="30" height="3.5" rx="1.75" fill="rgba(0,0,0,0.06)" />
    </svg>
  )
}

// 최대 5개 파일의 불규칙 오프셋 (right, bottomOffset, rotate, opacity)
const FILE_SLOTS: { right: number; bottom: number; rotate: number; opacity: number }[] = [
  { right: 14,  bottom: -6,  rotate:  18,  opacity: 0.42 },
  { right: 44,  bottom:  2,  rotate: -14,  opacity: 0.55 },
  { right: 28,  bottom:  8,  rotate:   6,  opacity: 0.65 },
  { right: 60,  bottom: -2,  rotate: -22,  opacity: 0.48 },
  { right: 20,  bottom:  4,  rotate:  -4,  opacity: 0.80 },
]

function SeriesGridCard({ seriesName, posts, colorIndex }: { seriesName: string; posts: Post[]; colorIndex: number }) {
  const bg = FOLDER_COLORS[colorIndex % FOLDER_COLORS.length]
  const fileCount = Math.min(posts.length, 5)

  return (
    <div style={{ background: bg, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>

      {/* 파일 아이콘 장식 영역 */}
      <div style={{ height: '120px', position: 'relative', overflow: 'hidden' }}>
        {FILE_SLOTS.slice(0, fileCount).map((slot, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: `${slot.bottom}px`,
              right: `${slot.right}px`,
              transform: `rotate(${slot.rotate}deg)`,
              zIndex: i,
              transformOrigin: 'bottom center',
            }}
          >
            <FileShape opacity={slot.opacity} />
          </div>
        ))}
      </div>

      {/* 시리즈 이름 + 편수 + 전체보기 */}
      <div style={{ padding: '0 1.25rem 0.85rem' }}>
        <Link href={`/series/${encodeURIComponent(seriesName)}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#111', margin: '0 0 0.35rem', letterSpacing: '-0.01em' }}>
            {seriesName}
          </h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.45)', margin: 0 }}>
            {posts.length}편
          </p>
          <Link href={`/series/${encodeURIComponent(seriesName)}`} style={{ textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(0,0,0,0.45)' }}>
            전체보기 →
          </Link>
        </div>
      </div>

      {/* 최근 3개 포스트 */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '0.5rem 0 0.6rem' }}>
        {posts.slice(0, 3).map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.3rem 1.25rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'rgba(0,0,0,0.38)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {formatDate(post.date)}
            </span>
            <p style={{ fontSize: '0.78rem', color: '#333', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', lineHeight: 1.45, flex: 1 }}>
              {post.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function SeriesView({ seriesEntries }: { seriesEntries: [string, Post[]][] }) {
  const [view, setView] = useState<'list' | 'grid'>('list')

  const btnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '32px', height: '32px', borderRadius: '6px',
    border: '1px solid var(--border)',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted)',
    cursor: 'pointer', transition: 'all 0.15s', fontSize: '1rem',
  })

  return (
    <div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {seriesEntries.map(([seriesName, posts], index) => (
            <SeriesGridCard key={seriesName} seriesName={seriesName} posts={posts} colorIndex={index} />
          ))}
        </div>
      )}
    </div>
  )
}
