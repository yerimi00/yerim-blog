'use client'

import { useState } from 'react'

type View = 'event' | 'schedule'

function CapsuleToggle({
  value,
  onChange,
}: {
  value: View
  onChange: (v: View) => void
}) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'var(--bg-secondary)', borderRadius: 100,
      padding: 3, position: 'relative', userSelect: 'none',
    }}>
      {/* sliding capsule */}
      <div style={{
        position: 'absolute',
        top: 3,
        left: value === 'event' ? 3 : 'calc(50% + 1px)',
        width: 'calc(50% - 4px)',
        bottom: 3,
        borderRadius: 100,
        background: 'var(--accent)',
        transition: 'left 0.2s ease-out',
        zIndex: 0,
      }} />
      {(['event', 'schedule'] as View[]).map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            position: 'relative', zIndex: 1,
            padding: '7px 20px',
            border: 'none', background: 'none',
            borderRadius: 100, cursor: 'pointer',
            fontSize: 13, fontWeight: 600,
            color: value === v ? '#fff' : 'var(--text-secondary)',
            transition: 'color 0.2s',
            minWidth: 80,
          }}
        >
          {v === 'event' ? '행사' : '일정'}
        </button>
      ))}
    </div>
  )
}

const EVENTS = [
  { date: '1월', label: '팀 발표' },
  { date: '2월', label: '팀 워크샵' },
]
const SCHEDULES = [
  { date: '오늘', label: '디자인 리뷰' },
  { date: '내일', label: '기획 미팅' },
  { date: '3일 후', label: '스튜디오 투어' },
]

export default function ViewToggleDemo() {
  const [view, setView] = useState<View>('event')
  const items = view === 'event' ? EVENTS : SCHEDULES

  return (
    <div style={{
      width: 300, margin: '0 auto',
      fontFamily: 'Pretendard, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <CapsuleToggle value={view} onChange={setView} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              background: 'var(--surface, #fff)',
              border: '1px solid var(--border, #e5e7eb)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-xl)',
              background: 'var(--surface-container)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'var(--accent)',
              flexShrink: 0,
            }}>
              {item.date}
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text, #111)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
