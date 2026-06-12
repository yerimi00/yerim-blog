'use client'

import { useRef, useState, useCallback, useLayoutEffect, useEffect } from 'react'
import { FiArrowRight } from 'react-icons/fi'

const FLEE_RADIUS = 130  // 감지 거리(px)
const FLEE_DIST   = 120  // 도망 거리(px)
const MARGIN      = 60   // 뷰포트 경계 여백(px)

const BTN_W = 140
const BTN_H = 48

export default function MagneticButtonDemo() {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const posRef         = useRef<{ x: number; y: number } | null>(null)
  const [displayPos, setDisplayPos] = useState<{ x: number; y: number } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 초기 절대 위치 계산 (getBoundingClientRect → position: fixed 기준)
  useLayoutEffect(() => {
    if (placeholderRef.current) {
      const rect = placeholderRef.current.getBoundingClientRect()
      const pos = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      posRef.current = { ...pos }
      setDisplayPos({ ...pos })
    }
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!posRef.current) return
      const { x: rx, y: ry } = posRef.current
      const dist = Math.hypot(e.clientX - rx, e.clientY - ry)

      if (dist < FLEE_RADIUS && dist > 0) {
        const angle = Math.atan2(e.clientY - ry, e.clientX - rx)
        const newX = Math.max(MARGIN, Math.min(window.innerWidth  - MARGIN, rx - Math.cos(angle) * FLEE_DIST))
        const newY = Math.max(MARGIN, Math.min(window.innerHeight - MARGIN, ry - Math.sin(angle) * FLEE_DIST))
        posRef.current = { x: newX, y: newY }
        setDisplayPos({ x: newX, y: newY })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const showToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast('잡았다! 🎉')
    timerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 0 }}>
        마우스를 가까이 가져가보세요
      </p>

      {/* 자연 위치 플레이스홀더 — 레이아웃 공간 유지 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48, marginBottom: 48 }}>
        <div ref={placeholderRef} style={{ width: BTN_W, height: BTN_H }} />
      </div>

      {/* 도망치는 버튼 — position: fixed로 페이지 전체를 돌아다님 */}
      {displayPos && (
        <button
          onClick={showToast}
          style={{
            position: 'fixed',
            left: displayPos.x - BTN_W / 2,
            top:  displayPos.y - BTN_H / 2,
            width:  BTN_W,
            height: BTN_H,
            transition: 'left 0.12s ease-out, top 0.12s ease-out',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'Pretendard, sans-serif',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(59,130,246,0.25)',
            zIndex: 50,
          }}
        >
          시작하기 <FiArrowRight size={15} />
        </button>
      )}

      <div style={{
        padding: '12px 16px',
        background: 'var(--surface-container)',
        borderRadius: 'var(--radius-lg)',
        fontSize: 13,
        color: toast ? 'var(--accent)' : 'var(--text-muted)',
        textAlign: 'center',
        transition: 'color 0.2s',
        fontWeight: toast ? 600 : 400,
      }}>
        {toast ?? '커서가 가까워지면 버튼이 도망칩니다.'}
      </div>
    </div>
  )
}
