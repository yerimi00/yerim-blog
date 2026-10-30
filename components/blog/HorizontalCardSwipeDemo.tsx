'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'

const CARD_W = 300
const PEEK = 24
const STACK_W = CARD_W + PEEK
const CARD_H = 420
const THRESHOLD = 60
const ANIM_MS = 320
// 원본 CSS transition과 동일한 스냅 곡선
const SNAP = { duration: ANIM_MS / 1000, ease: [0.25, 0.46, 0.45, 0.94] } as const

const CARDS = [
  { bg: '#3b82f6', label: '카드 1' },
  { bg: '#2170e4', label: '카드 2' },
  { bg: '#0058be', label: '카드 3' },
  { bg: '#575e70', label: '카드 4' },
]

const outerStyle: CSSProperties = {
  width: STACK_W,
  maxWidth: '100%',
  margin: '0 auto',
  height: CARD_H,
  fontFamily: 'Pretendard, sans-serif',
}

const stackStyle: CSSProperties = {
  position: 'relative',
  width: STACK_W,
  height: CARD_H,
  overflow: 'hidden',
  transform: 'translateZ(0)',
  touchAction: 'none',
  userSelect: 'none',
  cursor: 'grab',
  outline: 'none',
}

const cardWrapperBase: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: CARD_W,
  height: CARD_H,
  willChange: 'transform',
  paddingRight: 12,
  boxSizing: 'border-box',
}

const cardInnerBase: CSSProperties = {
  height: '100%',
  borderRadius: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const labelStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: '#fff',
}

const getScaleFromTx = (tx: number): number => {
  if (tx <= 0) return 1
  const p = Math.min(tx / CARD_W, 1)
  return 1 - 0.08 * p
}

export default function HorizontalCardSwipeDemo() {
  const [renderIdx, setRenderIdx] = useState(0)

  const snapIdxRef  = useRef(0)
  // 스택 전체 오프셋 — 각 카드가 useTransform으로 x·scale을 파생
  const offset      = useMotionValue(0)
  const dragRef     = useRef({ live: false, startX: 0, startOffset: 0 })
  const isAnimating = useRef(false)
  const stackRef    = useRef<HTMLDivElement>(null)
  const n = CARDS.length

  const snapToCurrent = useCallback(() => {
    animate(offset, -snapIdxRef.current * CARD_W, SNAP)
  }, [offset])

  const go = useCallback((dir: 1 | -1) => {
    if (isAnimating.current) return
    const next = Math.max(0, Math.min(n - 1, snapIdxRef.current + dir))
    if (next === snapIdxRef.current) return

    isAnimating.current = true
    snapIdxRef.current = next
    setRenderIdx(next)

    animate(offset, -next * CARD_W, SNAP).finished.finally(() => { isAnimating.current = false })
  }, [n, offset])

  useEffect(() => {
    const el = stackRef.current
    if (!el) return

    const handleStart = (x: number) => {
      if (isAnimating.current) return
      offset.stop()  // 진행 중인 되돌림 스냅을 멈추고 현재 위치에서 이어 잡기
      dragRef.current.startX      = x
      dragRef.current.startOffset = offset.get()
      dragRef.current.live        = true
      el.style.cursor = 'grabbing'
    }

    const handleMove = (x: number) => {
      if (!dragRef.current.live) return
      let delta = x - dragRef.current.startX
      const idx = snapIdxRef.current
      if (delta < 0 && idx >= n - 1) delta *= 0.2
      if (delta > 0 && idx <= 0)     delta *= 0.2
      offset.set(dragRef.current.startOffset + delta)
    }

    const handleEnd = (x: number) => {
      if (!dragRef.current.live) return
      dragRef.current.live = false
      el.style.cursor = 'grab'
      const delta = x - dragRef.current.startX
      const dir = delta < 0 ? 1 : -1
      const nextIdx = snapIdxRef.current + dir
      if (Math.abs(delta) > THRESHOLD && nextIdx >= 0 && nextIdx < n) {
        go(dir)
        return
      }
      snapToCurrent()
    }

    // Pointer Events (touch + mouse 통합) — setPointerCapture로 요소 밖 드래그도 추적
    const onPointerDown = (e: PointerEvent) => {
      handleStart(e.clientX)
      el.setPointerCapture(e.pointerId)
    }
    const onPointerMove   = (e: PointerEvent) => {
      if (!dragRef.current.live) return
      e.preventDefault()
      handleMove(e.clientX)
    }
    const onPointerUp     = (e: PointerEvent) => handleEnd(e.clientX)
    const onPointerCancel = (e: PointerEvent) => { if (dragRef.current.live) handleEnd(e.clientX) }
    const onKeyDown       = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1) }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    }

    el.addEventListener('pointerdown',   onPointerDown)
    el.addEventListener('pointermove',   onPointerMove,   { passive: false })
    el.addEventListener('pointerup',     onPointerUp)
    el.addEventListener('pointercancel', onPointerCancel)
    el.addEventListener('keydown',       onKeyDown)

    return () => {
      el.removeEventListener('pointerdown',   onPointerDown)
      el.removeEventListener('pointermove',   onPointerMove)
      el.removeEventListener('pointerup',     onPointerUp)
      el.removeEventListener('pointercancel', onPointerCancel)
      el.removeEventListener('keydown',       onKeyDown)
    }
  }, [go, snapToCurrent, n, offset])

  const pis = useMemo(
    () => [renderIdx - 1, renderIdx, renderIdx + 1, renderIdx + 2].filter(pi => pi >= 0 && pi < n),
    [renderIdx, n],
  )

  return (
    <div style={outerStyle}>
      <div ref={stackRef} tabIndex={0} style={stackStyle}>
        {pis.map(pi => {
          const card = CARDS[pi]
          return (
            <SlideCard key={pi} pi={pi} offset={offset} isActive={pi === renderIdx}>
              <div style={{ ...cardInnerBase, background: card.bg }}>
                <span style={labelStyle}>{card.label}</span>
              </div>
            </SlideCard>
          )
        })}
      </div>
    </div>
  )
}

// 카드 래퍼 — 공유 offset에서 자기 위치·스케일을 파생 (SSR 첫 렌더부터 같은 transform)
function SlideCard({ pi, offset, isActive, children }: {
  pi: number
  offset: MotionValue<number>
  isActive: boolean
  children: ReactNode
}) {
  const x     = useTransform(offset, o => o + pi * CARD_W)
  const scale = useTransform(x, getScaleFromTx)
  return (
    <motion.div style={{ ...cardWrapperBase, x, scale, pointerEvents: isActive ? 'auto' : 'none' }}>
      {children}
    </motion.div>
  )
}
