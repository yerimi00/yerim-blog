'use client'

import Link from 'next/link'

const SUB_FOLDERS = ['카드 스택 UI', '컬러 카드 스택']

export default function InteractionSeriesView({ seriesName }: { seriesName: string }) {
  return (
    <div className="series-folder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem 0.5rem' }}>
      {SUB_FOLDERS.map((name) => (
        <Link
          key={name}
          href={`/series/${encodeURIComponent(seriesName)}/${encodeURIComponent(name)}`}
          style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/folder.png"
            alt={name}
            style={{ width: '96px', height: 'auto', transition: 'transform 0.15s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'translateY(-4px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'translateY(0)' }}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
              {name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
