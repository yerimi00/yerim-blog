'use client'

import { useState } from 'react'

const CATEGORIES = [
  { key: 'cafe',    label: '카페', emoji: '☕' },
  { key: 'food',    label: '음식점', emoji: '🍽️' },
  { key: 'shopping', label: '쇼핑', emoji: '🛍️' },
  { key: 'exhibit', label: '전시', emoji: '🎨' },
]

export default function CategoryDimmingDemo() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ fontSize: 14, color: 'var(--text-muted, #6b7280)', marginBottom: 16, textAlign: 'center' }}>
        카테고리를 선택하면 나머지가 흐려져요
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {CATEGORIES.map(c => {
          const active = selected === c.key
          const dim = selected !== null && !active

          return (
            <button
              key={c.key}
              onClick={() => setSelected(active ? null : c.key)}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '16px 8px',
                borderRadius: 14,
                border: `2px solid ${active ? '#7c3aed' : 'var(--border, #e5e7eb)'}`,
                background: active ? '#ede9fe' : 'var(--surface, #fff)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: dim ? 0.45 : 1,
                filter: dim ? 'grayscale(70%)' : 'none',
              }}
            >
              <span style={{ fontSize: 28, transition: 'filter 0.2s' }}>
                {c.emoji}
              </span>
              <span style={{
                fontSize: 12, fontWeight: active ? 700 : 500,
                color: active ? '#7c3aed' : dim ? '#9ca3af' : 'var(--text, #374151)',
                transition: 'color 0.2s',
              }}>
                {c.label}
              </span>
            </button>
          )
        })}
      </div>

      {selected && (
        <div style={{
          marginTop: 16, padding: '14px',
          background: '#ede9fe',
          border: '1px solid #c4b5fd',
          borderRadius: 10, fontSize: 14,
          color: '#5b21b6', textAlign: 'center',
        }}>
          <strong>{CATEGORIES.find(c => c.key === selected)?.label}</strong> 업체를 검색합니다
        </div>
      )}
    </div>
  )
}
