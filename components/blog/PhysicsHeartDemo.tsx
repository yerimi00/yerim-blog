'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { IconType } from 'react-icons'
import { FiHeart, FiStar, FiZap, FiSun, FiSmile, FiCloud, FiMoon } from 'react-icons/fi'

const FLOAT_ICONS: IconType[] = [FiHeart, FiStar, FiZap, FiSun, FiSmile, FiCloud, FiMoon]
const FLOAT_COLORS = ['#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#06b6d4']
const SHEET_FULL = 340

interface Heart {
  id: number
  x: number
  y: number
  vy: number
  vx: number
  size: number
  Icon: IconType
  iconColor: string
  opacity: number
}

let nextId = 0

export default function PhysicsHeartDemo() {
  const [hearts, setHearts] = useState<Heart[]>([])
  const [todos, setTodos] = useState([
    { id: 1, label: '독서하기', done: false },
    { id: 2, label: '운동하기', done: false },
    { id: 3, label: '산책하기', done: false },
    { id: 4, label: '글쓰기', done: false },
  ])
  const [sheetY, setSheetY] = useState(SHEET_FULL)
  const [dragging, setDragging] = useState(false)
  const startYRef = useRef(0)
  const startSheetRef = useRef(SHEET_FULL)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)

  const spawnHeart = useCallback(() => {
    const containerW = containerRef.current?.clientWidth ?? 320
    setHearts(prev => [
      ...prev,
      {
        id: nextId++,
        x: 40 + Math.random() * (containerW - 80),
        y: 200,
        vx: (Math.random() - 0.5) * 3,
        vy: -6 - Math.random() * 4,
        size: 20 + Math.random() * 20,
        Icon: FLOAT_ICONS[Math.floor(Math.random() * FLOAT_ICONS.length)],
        iconColor: FLOAT_COLORS[Math.floor(Math.random() * FLOAT_COLORS.length)],
        opacity: 1,
      },
    ])
  }, [])

  const removeHeart = useCallback(() => {
    setHearts(prev => prev.slice(0, -1))
  }, [])

  useEffect(() => {
    const tick = () => {
      setHearts(prev =>
        prev
          .map(h => ({
            ...h,
            x: h.x + h.vx,
            y: h.y + h.vy,
            vy: h.vy + 0.2,
            opacity: h.y < 60 ? Math.max(0, h.opacity - 0.03) : h.opacity,
          }))
          .filter(h => h.opacity > 0 && h.y < 420)
      )
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        if (!t.done) spawnHeart()
        else removeHeart()
        return { ...t, done: !t.done }
      })
    )
  }

  const onSheetPointerDown = (e: React.PointerEvent) => {
    const el = e.target as HTMLElement
    if (el.closest('button')) return
    startYRef.current = e.clientY
    startSheetRef.current = sheetY
    setDragging(true)
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => {
      const delta = e.clientY - startYRef.current
      setSheetY(Math.max(0, Math.min(SHEET_FULL, startSheetRef.current + delta)))
    }
    const onUp = (e: PointerEvent) => {
      const delta = e.clientY - startYRef.current
      setSheetY(delta < -60 || startSheetRef.current + delta < SHEET_FULL / 2 ? 0 : SHEET_FULL)
      setDragging(false)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging])

  return (
    <div
      ref={containerRef}
      style={{
        width: 320, height: 520, margin: '0 auto',
        background: 'linear-gradient(160deg, var(--surface-container) 0%, var(--bg-secondary) 100%)',
        borderRadius: 24, position: 'relative',
        overflow: 'hidden', fontFamily: 'Pretendard, sans-serif',
        userSelect: 'none',
      }}
    >
      {/* Hearts */}
      {hearts.map(h => (
        <div
          key={h.id}
          style={{
            position: 'absolute',
            left: h.x, top: h.y,
            fontSize: h.size,
            opacity: h.opacity,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            transition: 'none',
          }}
        >
          <h.Icon size={h.size} color={h.iconColor} />
        </div>
      ))}

      {/* Top area */}
      <div style={{ padding: '28px 24px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>투두 리스트</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {todos.filter(t => t.done).length}/{todos.length} 완료
        </div>
      </div>

      {/* Bottom sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: SHEET_FULL + 60,
          background: 'var(--surface)',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          transform: `translateY(${sheetY}px)`,
          transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1)',
          cursor: 'grab',
          zIndex: 10,
        }}
        onPointerDown={onSheetPointerDown}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 'var(--radius-sm)', background: 'var(--border)' }} />
        </div>

        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
            오늘의 할 일
          </div>
          {todos.map(t => (
            <button
              key={t.id}
              onClick={() => toggleTodo(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', background: 'none', border: 'none',
                padding: '11px 0', cursor: 'pointer',
                borderBottom: '1px solid var(--bg-secondary)',
                textAlign: 'left',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `2px solid ${t.done ? 'var(--accent)' : 'var(--border)'}`,
                background: t.done ? 'var(--accent)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}>
                {t.done && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <polyline points="1.5,6.5 4.5,9.5 10.5,2.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{
                fontSize: 14, color: t.done ? 'var(--text-muted)' : 'var(--text)',
                textDecoration: t.done ? 'line-through' : 'none',
                transition: 'all 0.2s',
              }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
