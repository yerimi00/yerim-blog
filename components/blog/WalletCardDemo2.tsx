'use client'

import { motion } from 'motion/react'

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
const LIFT       = { duration: ANIM_MS / 1000, ease: [0.34, 1.4, 0.64, 1] } as const

const CARDS = [
  { bg: '#5667f5', textColor: '#fff',    label: '카드 1' },
  { bg: '#f5f5f5', textColor: '#222',    label: '카드 2' },
  { bg: '#f59e0b', textColor: '#fff',    label: '카드 3' },
  { bg: '#0f172a', textColor: '#e2e8f0', label: '카드 4' },
]

export default function WalletCardDemo2() {
  const cardTop = (i: number) => FRONT_TOP - i * PEEK_REST

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
        <motion.div
          key={i}
          initial={false}
          animate={{ top: cardTop(i), scale: 1 }}
          // 첫 카드는 제자리 고정, 나머지는 호버 시 위로 올라온다
          whileHover={{ top: i === 0 ? cardTop(i) : cardTop(i) - HOVER_LIFT, scale: 1.06 }}
          transition={LIFT}
          style={{
            position: 'absolute',
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
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: card.textColor }}>
            {card.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
