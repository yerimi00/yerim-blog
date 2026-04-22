import React from 'react'

interface YearTimelineProps<T> {
  items: T[]
  getYear: (item: T) => string
  renderItems: (items: T[]) => React.ReactNode
}

export default function YearTimeline<T,>({ items, getYear, renderItems }: YearTimelineProps<T>) {
  const grouped = Object.entries(
    items.reduce<Record<string, T[]>>((acc, item) => {
      const year = getYear(item)
      ;(acc[year] ??= []).push(item)
      return acc
    }, {})
  ).sort(([a], [b]) => Number(b) - Number(a))

  return (
    <div>
      {grouped.map(([year, groupItems], gi) => (
        <div key={year} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', columnGap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'var(--accent)', border: '2px solid var(--bg)',
              flexShrink: 0, marginTop: '4px',
            }} />
            {gi < grouped.length - 1 && (
              <div style={{ width: '1px', flex: 1, background: 'var(--border)', marginTop: '4px' }} />
            )}
          </div>
          <div style={{ paddingBottom: gi < grouped.length - 1 ? '2rem' : 0 }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)',
              fontFamily: 'JetBrains Mono, monospace', display: 'block', marginBottom: '0.75rem',
            }}>
              {year}
            </span>
            {renderItems(groupItems)}
          </div>
        </div>
      ))}
    </div>
  )
}
