'use client'

import { useState } from 'react'

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

      <button
        disabled={!canSave}
        style={{
          width: '100%', padding: '12px', border: 'none', borderRadius: 'var(--radius-xl)',
          background: canSave ? 'var(--accent)' : 'var(--border)',
          color: canSave ? '#fff' : 'var(--text-muted)',
          fontSize: 14, fontWeight: 600,
          cursor: canSave ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
        onClick={() => alert(`적용됨!\n컬러: ${colors.join(', ') || '없음'}\n스타일: ${style}\n핏: ${fit}`)}
      >
        필터 적용
      </button>

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
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 100,
        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border, #e5e7eb)'}`,
        background: active ? 'var(--accent)' : 'var(--surface, #fff)',
        color: active ? '#fff' : 'var(--text, #374151)',
        fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
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
