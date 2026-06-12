'use client'

import { useState } from 'react'
import type { IconType } from 'react-icons'
import { FiCalendar, FiStar, FiBookmark } from 'react-icons/fi'

type Tab = 'reserve' | 'review' | 'saved'

const TABS: { key: Tab; label: string }[] = [
  { key: 'reserve', label: '예약' },
  { key: 'review', label: '후기' },
  { key: 'saved', label: '저장' },
]

const CONTENT: Record<Tab, { Icon: IconType; items: string[] }> = {
  reserve: { Icon: FiCalendar, items: ['레스토랑 예약 (D-3)', '미술관 예약 (D-7)', '공연 예약 (D-14)'] },
  review:  { Icon: FiStar,     items: ['한강뷰 카페 — ★★★★★', '이탈리안 레스토랑 — ★★★★☆', '서촌 갤러리 — ★★★★★'] },
  saved:   { Icon: FiBookmark, items: ['모던 브런치 카페 (즐겨찾기)', '팝업 전시회 (저장됨)'] },
}

export default function MyTabsDemo() {
  const [tab, setTab] = useState<Tab>('reserve')
  const content = CONTENT[tab]

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid var(--border, #e5e7eb)',
        marginBottom: 20,
      }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '10px 0',
              background: 'none', border: 'none',
              cursor: 'pointer',
              fontSize: 14, fontWeight: tab === t.key ? 700 : 400,
              color: tab === t.key ? 'var(--text, #111)' : 'var(--text-muted, #6b7280)',
              position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            {t.label}
            {tab === t.key && (
              <div style={{
                position: 'absolute', bottom: -2, left: 0, right: 0, height: 2,
                background: 'var(--accent)',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {content.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 14px',
              background: 'var(--surface, #fff)',
              border: '1px solid var(--border, #e5e7eb)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <content.Icon size={20} color="var(--accent)" />
            <span style={{ fontSize: 14, color: 'var(--text, #111)' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
