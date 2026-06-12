'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { IconType } from 'react-icons'
import { FiTrendingUp, FiLayers, FiCamera, FiFileText } from 'react-icons/fi'

const BANNERS: { bg: string; title: string; sub: string; Icon: IconType }[] = [
  { bg: '#3b82f6', title: '2025 트렌드 리포트', sub: '올해 인기 인터랙션을 확인하세요', Icon: FiTrendingUp },
  { bg: '#2170e4', title: '신규 컴포넌트 출시', sub: '새로운 UI 컴포넌트를 만나보세요', Icon: FiLayers },
  { bg: '#0058be', title: '포트폴리오 갤러리', sub: '다양한 프로젝트를 한눈에 확인하세요', Icon: FiCamera },
  { bg: '#575e70', title: '이번 주 인기 아티클', sub: '놓치지 말아야 할 콘텐츠 모음', Icon: FiFileText },
]

const AUTO_DELAY = 7000

export default function BannerCarouselDemo() {
  const [idx, setIdx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startXRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const n = BANNERS.length

  const go = useCallback((next: number) => {
    setIdx(((next % n) + n) % n)
  }, [n])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => go(idx + 1), AUTO_DELAY)
  }, [go, idx])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [idx, resetTimer])

  const onPointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX
    setDragging(true)
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return
    setDragging(false)
    const delta = e.clientX - startXRef.current
    if (Math.abs(delta) > 50) {
      go(idx + (delta < 0 ? 1 : -1))
    }
  }

  const banner = BANNERS[idx]

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      {/* Banner */}
      <div
        style={{
          height: 180, borderRadius: 18,
          background: banner.bg,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'grab', userSelect: 'none',
          transition: 'background 0.5s ease',
          position: 'relative', overflow: 'hidden',
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* GPU hint */}
        <div style={{ willChange: 'transform', transform: 'translateZ(0)', textAlign: 'center' }}>
          <banner.Icon size={42} color="rgba(255,255,255,0.92)" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{banner.title}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{banner.sub}</div>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.2)' }}>
          <div
            key={idx}
            style={{
              height: '100%', background: 'rgba(255,255,255,0.8)',
              borderRadius: 'var(--radius-sm)',
              animation: `banner-progress ${AUTO_DELAY}ms linear forwards`,
            }}
          />
        </div>

        <style>{`
          @keyframes banner-progress {
            from { width: 0% }
            to   { width: 100% }
          }
        `}</style>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === idx ? 20 : 7, height: 7, borderRadius: 'var(--radius)',
              border: 'none', padding: 0, cursor: 'pointer',
              background: i === idx ? 'var(--accent)' : 'var(--border)',
              transition: 'all 0.25s',
            }}
          />
        ))}
      </div>

      {/* Prev/Next arrows */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
        {['←', '→'].map((arrow, i) => (
          <button
            key={arrow}
            onClick={() => go(idx + (i === 0 ? -1 : 1))}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--border, #e5e7eb)',
              background: 'var(--surface, #fff)',
              cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text, #374151)',
            }}
          >
            {arrow}
          </button>
        ))}
      </div>
    </div>
  )
}
