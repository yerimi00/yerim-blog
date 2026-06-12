import type { CardData } from './CardStackDemo'

const DARK     = '#16181f'
const HANDLE_H = 20
const HEADER_H = 54
const PROGRESS_H = 40
const WHITE_H  = 400
const CARD_H   = HANDLE_H + HEADER_H + PROGRESS_H + WHITE_H  // 514

interface Props {
  card:       CardData
  pi:         number
  n:          number
  isActive:   boolean
  getCardRef: (pi: number) => (el: HTMLDivElement | null) => void
}

export default function CardStackCard({ card, pi, n, isActive, getCardRef }: Props) {
  return (
    <div
      ref={getCardRef(pi)}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: CARD_H,
        willChange: 'transform',
        pointerEvents: isActive ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 드래그 핸들 */}
      <div style={{
        height: HANDLE_H,
        background: DARK,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 9999, background: '#3d4055' }} />
      </div>

      {/* 헤더 */}
      <div style={{ background: DARK, flexShrink: 0 }}>
        <div style={{
          height: HEADER_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '0 20px',
        }}>
          <button style={{
            position: 'absolute', left: 20,
            width: 28, height: 28,
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <span style={{ color: '#ffffff', fontSize: 15, fontWeight: 600 }}>카드 스택 UI</span>
        </div>
        <div style={{
          height: PROGRESS_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>카드 스택 UI</span>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>{pi + 1}/{n}</span>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{
        flex: 1,
        background: DARK,
        borderRadius: '20px 20px 0 0',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 24px 0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <button style={{
          position: 'absolute', top: 24, right: 24,
          width: 32, height: 32,
          background: '#2a2d3a', border: '1px solid #3d4055',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#9ca3af', padding: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>

        <h2 style={{
          margin: 0, fontSize: 22, fontWeight: 800,
          color: '#f9fafb', lineHeight: 1.35,
          whiteSpace: 'pre-line', paddingRight: 48,
        }}>
          {card.title}
        </h2>

        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 6, textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, color: '#6b7280' }}>{card.metricLabel}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: card.metricColor }}>{card.metricValue}</div>
          <div style={{ fontSize: 13, color: '#9ca3af' }}>{card.metricDesc}</div>
        </div>

        <div style={{ paddingBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb', marginBottom: 8 }}>
            {card.listTitle}
          </div>
          <div style={{ height: 1, background: '#2d3040', marginBottom: 8 }} />
          {card.list.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#4b94ff', minWidth: 16 }}>
                {i + 1}
              </span>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {item.letter}
              </div>
              <span style={{ flex: 1, fontSize: 14, color: '#d1d5db' }}>{item.name}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f3f4f6' }}>{item.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
