'use client'

import { motion } from 'motion/react'
import { fastTween } from '@/components/motion/presets'

const LABELS = {
  predict_output: '출력 예측',
  order: '순서 맞히기',
  step_diagram: '단계별로 보기',
  compare_toggle: '비교해 보기',
  ox_quiz: 'OX 퀴즈',
  sql_table: 'SQL 실행해 보기',
} as const

export type WidgetType = keyof typeof LABELS

// 위젯 공통 틀: 손글씨 제목 + 위젯 종류
export default function WidgetFrame({ type, children }: { type: WidgetType; children: React.ReactNode }) {
  return (
    <section
      aria-label={`직접 풀어보기: ${LABELS[type]}`}
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        background: 'var(--surface)',
        marginBottom: '2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <p className="hand" style={{ fontSize: '1.5rem', lineHeight: 1, color: 'var(--text)', margin: 0 }}>🎮 직접 풀어보기</p>
        <span className="tag-badge" style={{ padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>{LABELS[type]}</span>
      </div>
      {children}
    </section>
  )
}

// 위젯 버튼. primary는 강조색 배경
export function WidgetButton({
  children,
  onClick,
  disabled,
  primary,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  primary?: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={fastTween}
      style={{
        height: '38px',
        padding: '0 1rem',
        borderRadius: 'var(--radius)',
        border: primary ? 'none' : '1px solid var(--border)',
        background: primary ? 'var(--accent)' : 'var(--surface)',
        color: primary ? 'var(--on-primary)' : 'var(--text)',
        fontWeight: 600,
        fontSize: '0.85rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {children}
    </motion.button>
  )
}

// 정답·오답 해설 한 줄
export function Explain({ correct, children }: { correct: boolean; children?: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        margin: '0.75rem 0 0',
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.88rem',
        lineHeight: 1.6,
        color: 'var(--text)',
        background: `color-mix(in srgb, var(${correct ? '--success' : '--accent'}) 10%, transparent)`,
        borderLeft: `3px solid var(${correct ? '--success' : '--accent'})`,
      }}
    >
      <strong style={{ color: `var(${correct ? '--success' : '--accent'})` }}>{correct ? '정답이에요! ' : '아쉬워요. '}</strong>
      {children}
    </motion.p>
  )
}
