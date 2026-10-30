'use client'

import { useState } from 'react'
import type { IconType } from 'react-icons'
import { FiCoffee, FiHeart, FiShoppingBag, FiImage } from 'react-icons/fi'
import { motion } from 'motion/react'

// 원본 `0.2s ease`
const TWEEN = { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } as const

const CATEGORIES: { key: string; label: string; Icon: IconType }[] = [
  { key: 'cafe',     label: '카페',   Icon: FiCoffee },
  { key: 'food',     label: '음식점', Icon: FiHeart },
  { key: 'shopping', label: '쇼핑',   Icon: FiShoppingBag },
  { key: 'exhibit',  label: '전시',   Icon: FiImage },
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
            <motion.button
              key={c.key}
              onClick={() => setSelected(active ? null : c.key)}
              initial={false}
              animate={{
                borderColor: active ? 'var(--accent)' : 'var(--border, #e5e7eb)',
                backgroundColor: active ? 'var(--accent)' : 'var(--surface, #fff)',
                opacity: dim ? 0.45 : 1,
                filter: dim ? 'grayscale(70%)' : 'grayscale(0%)',
              }}
              transition={TWEEN}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '16px 8px',
                borderRadius: 'var(--radius-xl)',
                borderWidth: 2, borderStyle: 'solid',
                cursor: 'pointer',
              }}
            >
              <motion.span
                initial={false}
                animate={{ color: active ? '#fff' : dim ? 'var(--border)' : 'var(--text-muted, #9ca3af)' }}
                transition={TWEEN}
                style={{ display: 'flex' }}
              >
                <c.Icon size={26} />
              </motion.span>
              <motion.span
                initial={false}
                animate={{ color: active ? '#fff' : dim ? 'var(--text-muted)' : 'var(--text, #374151)' }}
                transition={TWEEN}
                style={{ fontSize: 12, fontWeight: active ? 700 : 500 }}
              >
                {c.label}
              </motion.span>
            </motion.button>
          )
        })}
      </div>

      {selected && (
        <div style={{
          marginTop: 16, padding: '14px',
          background: 'var(--surface-container)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', fontSize: 14,
          color: 'var(--text)', textAlign: 'center',
        }}>
          <strong>{CATEGORIES.find(c => c.key === selected)?.label}</strong> 업체를 검색합니다
        </div>
      )}
    </div>
  )
}
