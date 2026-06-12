'use client'

import { useState } from 'react'

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 100,
        border: `1.5px solid ${active ? '#7c3aed' : 'var(--border, #e5e7eb)'}`,
        background: active ? '#ede9fe' : 'var(--surface, #fff)',
        color: active ? '#7c3aed' : 'var(--text, #374151)',
        fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  )
}

const AREAS = ['강남', '서초', '마포', '종로', '송파', '용산']
const STYLES = ['모던', '빈티지', '로맨틱', '내추럴']
const CAPACITY_OPTIONS = ['50명 이하', '100명', '200명', '300명 이상']

export default function ChipFilterDemo() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedCap, setSelectedCap] = useState<string | null>(null)

  const toggleStyle = (v: string) =>
    setSelectedStyles(prev =>
      prev.includes(v) ? prev.filter(s => s !== v) : [...prev, v]
    )

  const totalSelected = (selectedArea ? 1 : 0) + selectedStyles.length + (selectedCap ? 1 : 0)

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <Section label="지역 (단일 선택)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {AREAS.map(a => (
            <Chip key={a} active={selectedArea === a} onClick={() => setSelectedArea(selectedArea === a ? null : a)}>
              {a}
            </Chip>
          ))}
        </div>
      </Section>

      <Section label="스타일 (다중 선택)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STYLES.map(s => (
            <Chip key={s} active={selectedStyles.includes(s)} onClick={() => toggleStyle(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </Section>

      <Section label="수용 인원 (단일 선택)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {CAPACITY_OPTIONS.map(c => (
            <Chip key={c} active={selectedCap === c} onClick={() => setSelectedCap(selectedCap === c ? null : c)}>
              {c}
            </Chip>
          ))}
        </div>
      </Section>

      <div style={{
        marginTop: 16, padding: '12px 14px',
        background: 'var(--surface, #f9fafb)',
        border: '1px solid var(--border, #e5e7eb)',
        borderRadius: 10, fontSize: 13,
        color: totalSelected > 0 ? 'var(--text, #111)' : 'var(--text-muted, #9ca3af)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>
          {totalSelected > 0
            ? `필터 ${totalSelected}개 적용됨`
            : '필터를 선택하세요'}
        </span>
        {totalSelected > 0 && (
          <button
            onClick={() => { setSelectedArea(null); setSelectedStyles([]); setSelectedCap(null) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#7c3aed', fontWeight: 600,
            }}
          >
            초기화
          </button>
        )}
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted, #6b7280)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      {children}
    </div>
  )
}
