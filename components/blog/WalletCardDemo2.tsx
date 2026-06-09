'use client'

import { useState } from 'react'

const N          = 4
const WALLET_W   = 300
const WALLET_H   = 400
const CARD_W     = 260
const CARD_H     = 150
const CARD_LEFT  = (WALLET_W - CARD_W) / 2
const BOTTOM_GAP = 20
const FRONT_TOP  = WALLET_H - CARD_H - BOTTOM_GAP
const PEEK_REST  = 18
const HOVER_LIFT = 28   // 호버된 카드만 올라오는 높이
const ANIM_MS    = 300

const CARDS = [
  { bg: '#5667f5', textColor: '#fff',    label: '카드 1' },
  { bg: '#f5f5f5', textColor: '#222',    label: '카드 2' },
  { bg: '#f59e0b', textColor: '#fff',    label: '카드 3' },
  { bg: '#0f172a', textColor: '#e2e8f0', label: '카드 4' },
]

export default function WalletCardDemo2() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const cardTop = (i: number) => {
    const base = FRONT_TOP - i * PEEK_REST
    if (i === 0) return base  // 첫 카드는 제자리 고정
    return hoveredCard === i ? base - HOVER_LIFT : base
  }

  return (
    <div
      style={{
        width: WALLET_W,
        height: WALLET_H,
        margin: '0 auto',
        background: '#111',
        borderRadius: 24,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Pretendard, sans-serif',
        userSelect: 'none',
      }}
    >
      <div style={{ position: 'absolute', top: 28, left: 24, zIndex: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
          ₩1,200,000
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>총 잔액</div>
      </div>

      {CARDS.map((card, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: cardTop(i),
            left: CARD_LEFT,
            width: CARD_W,
            height: CARD_H,
            zIndex: N - i,
            borderRadius: 14,
            background: card.bg,
            boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
            padding: '16px 20px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            transform: hoveredCard === i ? 'scale(1.06)' : 'scale(1)',
            transition: `top ${ANIM_MS}ms cubic-bezier(0.34, 1.4, 0.64, 1), transform ${ANIM_MS}ms cubic-bezier(0.34, 1.4, 0.64, 1)`,
          }}
          onMouseEnter={() => setHoveredCard(i)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: card.textColor }}>
            {card.label}
          </span>
        </div>
      ))}
    </div>
  )
}
