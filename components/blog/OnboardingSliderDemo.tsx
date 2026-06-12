'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { IconType } from 'react-icons'
import { FiCalendar, FiBarChart2, FiSun } from 'react-icons/fi'

const SLIDES: { Icon: IconType; title: string; desc: string; bg: string }[] = [
  { Icon: FiCalendar,  title: '스마트 플래너', desc: '나만의 일정을\n스마트하게 계획하세요', bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
  { Icon: FiBarChart2, title: '한눈에 비교',   desc: '다양한 옵션을\n한눈에 비교해요',       bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' },
  { Icon: FiSun,       title: '완벽한 하루',   desc: '소중한 순간을 더\n특별하게 만들어요',   bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
]

const ANIM_MS = 380
const AUTO_DELAY = 3500

export default function OnboardingSliderDemo() {
  const [idx, setIdx] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startXRef = useRef(0)
  const dragging = useRef(false)

  const go = useCallback((next: number) => {
    setIdx(Math.max(0, Math.min(SLIDES.length - 1, next)))
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIdx(i => (i + 1) % SLIDES.length)
    }, AUTO_DELAY)
  }, [])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [idx, resetTimer])

  const onPointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX
    dragging.current = true
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    const delta = e.clientX - startXRef.current
    if (Math.abs(delta) > 50) {
      go(idx + (delta < 0 ? 1 : -1))
      resetTimer()
    }
  }

  const slide = SLIDES[idx]

  return (
    <div style={{ width: 300, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <div
        ref={containerRef}
        style={{
          height: 380, borderRadius: 24,
          background: slide.bg,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          cursor: 'grab',
          transition: `background ${ANIM_MS}ms ease`,
          userSelect: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div style={{ marginBottom: 20, transition: `transform ${ANIM_MS}ms ease` }}>
          <slide.Icon size={64} color="rgba(0,0,0,0.5)" />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
          {slide.title}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
          {slide.desc}
        </div>
      </div>

      {/* Indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { go(i); resetTimer() }}
            style={{
              width: i === idx ? 24 : 8, height: 8,
              borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
              background: i === idx ? 'var(--accent)' : 'var(--border)',
              transition: 'all 0.25s ease', padding: 0,
            }}
          />
        ))}
      </div>

      {/* Prev/Next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button
          onClick={() => { go(idx - 1); resetTimer() }}
          disabled={idx === 0}
          style={{
            padding: '10px 20px', borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border)',
            background: 'var(--surface, #fff)',
            color: 'var(--text-muted, #9ca3af)',
            cursor: idx === 0 ? 'default' : 'pointer',
            opacity: idx === 0 ? 0.4 : 1,
            fontSize: 13, fontWeight: 600,
          }}
        >
          이전
        </button>
        <button
          onClick={() => { go(idx + 1); resetTimer() }}
          disabled={idx === SLIDES.length - 1}
          style={{
            padding: '10px 20px', borderRadius: 'var(--radius-xl)',
            border: 'none',
            background: idx === SLIDES.length - 1 ? 'var(--border)' : 'var(--accent)',
            color: '#fff',
            cursor: idx === SLIDES.length - 1 ? 'default' : 'pointer',
            fontSize: 13, fontWeight: 600,
          }}
        >
          {idx === SLIDES.length - 1 ? '완료' : '다음'}
        </button>
      </div>
    </div>
  )
}
