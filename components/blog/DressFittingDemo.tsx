'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { fastTween } from '@/components/motion/presets'

const COLORS = ['블랙', '화이트', '그레이', '네이비', '베이지', '브라운']
const STYLES = ['캐주얼', '포멀', '스포티', 'Y2K', '미니멀']
const FITS = ['슬림핏', '레귤러핏', '오버핏', '와이드핏', '크롭']

export default function DressFittingDemo() {
  const [colors, setColors] = useState<string[]>([])
  const [style, setStyle] = useState<string | null>(null)
  const [fit, setFit] = useState<string | null>(null)

  const toggleColor = (c: string) =>
    setColors(prev => prev.includes(c) ? prev.filter(v => v !== c) : [...prev, c])

  const canSave = style !== null && fit !== null

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <Section label="컬러 (다중 선택)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {COLORS.map(c => (
            <Pill
              key={c}
              active={colors.includes(c)}
              onClick={() => toggleColor(c)}
            >
              {c}
            </Pill>
          ))}
        </div>
      </Section>

      <Section label="스타일 (단일 선택)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STYLES.map(s => (
            <Pill
              key={s}
              active={style === s}
              onClick={() => setStyle(style === s ? null : s)}
            >
              {s}
            </Pill>
          ))}
        </div>
      </Section>

      <Section label="핏 (단일 선택)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FITS.map(f => (
            <Pill
              key={f}
              active={fit === f}
              onClick={() => setFit(fit === f ? null : f)}
            >
              {f}
            </Pill>
          ))}
        </div>
      </Section>

      <motion.button
        disabled={!canSave}
        initial={false}
        animate={{
          backgroundColor: canSave ? 'var(--accent)' : 'var(--border)',
          color: canSave ? '#fff' : 'var(--text-muted)',
        }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: '100%', padding: '12px', border: 'none', borderRadius: 'var(--radius-xl)',
          fontSize: 14, fontWeight: 600,
          cursor: canSave ? 'pointer' : 'default',
        }}
        onClick={() => alert(`적용됨!\n컬러: ${colors.join(', ') || '없음'}\n스타일: ${style}\n핏: ${fit}`)}
      >
        필터 적용
      </motion.button>

      {!canSave && (
        <div style={{ fontSize: 12, color: 'var(--text-muted, #9ca3af)', textAlign: 'center', marginTop: 8 }}>
          스타일과 핏은 필수입니다
        </div>
      )}
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      initial={false}
      animate={{
        borderColor: active ? 'var(--accent)' : 'var(--border, #e5e7eb)',
        backgroundColor: active ? 'var(--accent)' : 'var(--surface, #fff)',
        color: active ? '#fff' : 'var(--text, #374151)',
      }}
      transition={fastTween}
      style={{
        padding: '7px 14px', borderRadius: 100,
        borderWidth: 1.5, borderStyle: 'solid',
        fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: 'pointer',
      }}
    >
      {children}
    </motion.button>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #6b7280)', marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  )
}
