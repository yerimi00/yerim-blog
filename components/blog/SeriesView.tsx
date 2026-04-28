'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/types'
import SeriesList from './SeriesList'
import { HiBars3, HiOutlineSquares2X2 } from 'react-icons/hi2'


function SeriesGridCard({ seriesName, posts }: { seriesName: string; posts: Post[] }) {
  return (
    <Link
      href={`/series/${encodeURIComponent(seriesName)}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/folder.png"
        alt={seriesName}
        style={{ width: '96px', height: 'auto', transition: 'transform 0.15s ease' }}
        onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'translateY(-4px)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'translateY(0)' }}
      />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
          {seriesName}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          {posts.length}편
        </div>
      </div>
    </Link>
  )
}

export default function SeriesView({ seriesEntries }: { seriesEntries: [string, Post[]][] }) {
  const [view, setView] = useState<'list' | 'grid'>('grid')

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem 0.5rem' }}>
          {seriesEntries.map(([seriesName, posts]) => (
            <SeriesGridCard key={seriesName} seriesName={seriesName} posts={posts} />
          ))}
        </div>
      )}
    </div>
  )
}
