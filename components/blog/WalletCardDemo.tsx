'use client'

import { useState } from 'react'

const N          = 4
const WALLET_W   = 300
const WALLET_H   = 400
const CARD_W     = 260
const CARD_H     = 150
const CARD_LEFT  = (WALLET_W - CARD_W) / 2   // 20
const BOTTOM_GAP = 20
// 앞 카드(pos=0)의 top 기준점 — 지갑 하단 고정
const FRONT_TOP  = WALLET_H - CARD_H - BOTTOM_GAP   // 230
const PEEK_REST  = 18   // 접힌 상태: 카드 헤더 18px씩 노출
const PEEK_OPEN  = 62   // 열린 상태: 카드 62px씩 노출
const ANIM_MS    = 380

const CARDS = [
  { bg: '#3b82f6', textColor: '#fff',    label: '카드 1' },
  { bg: '#d9dff5', textColor: '#0058be', label: '카드 2' },
  { bg: '#0058be', textColor: '#fff',    label: '카드 3' },
  { bg: '#575e70', textColor: '#fff',    label: '카드 4' },
]

export default function WalletCardDemo() {
  const [hovered, setHovered] = useState(false)
  const [pinned,  setPinned]  = useState(false)
  const open = hovered || pinned

  // pos=0: 앞 카드(하단), pos=N-1: 뒤 카드(상단으로 peek)
  const cardTop = (pos: number) =>
    FRONT_TOP - pos * (open ? PEEK_OPEN : PEEK_REST)

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
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPinned(p => !p)}
    >
      {/* 잔액 — 카드 위 상단 고정, 카드보다 높은 z-index */}
      <div style={{ position: 'absolute', top: 28, left: 24, zIndex: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
          ₩1,200,000
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>총 잔액</div>
      </div>

      {/* 카드들 — 하단 정렬, hover/click 시 위로 펼쳐짐 */}
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
            transition: `top ${ANIM_MS}ms cubic-bezier(0.34, 1.4, 0.64, 1)`,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: card.textColor }}>
            {card.label}
          </span>
        </div>
      ))}
    </div>
  )
}
