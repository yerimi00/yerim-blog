'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { animate, useMotionValue } from 'motion/react'
import CardStackCard from './CardStackCard'

const DARK = '#16181f'
const HANDLE_H = 20
export const CARD_H = 514
const PEEK = HANDLE_H
const STACK_H = CARD_H + PEEK     // 534
const THRESHOLD = 70
const ANIM_MS = 360
// 원본 CSS transition과 동일한 스냅 곡선
const SNAP = { duration: ANIM_MS / 1000, ease: [0.25, 0.46, 0.45, 0.94] } as const

const outerStyle: CSSProperties = {
  maxWidth: '400px',
  margin: '0 auto',
  background: DARK,
  borderRadius: '20px',
  overflow: 'hidden',
  height: STACK_H,
  fontFamily: 'Pretendard, sans-serif',
}

const stackStyle: CSSProperties = {
  position: 'relative',
  height: STACK_H,
  overflow: 'hidden',
  transform: 'translateZ(0)',
  touchAction: 'none',
  userSelect: 'none',
  cursor: 'grab',
}

const N_CARDS = 3

export default function CardStackDemo() {
  const [renderIdx, setRenderIdx] = useState(0)

  const snapIdxRef  = useRef(0)
  // 스택 전체 오프셋 — 각 카드가 useTransform으로 y·scale을 파생
  const offset      = useMotionValue(0)
  const dragRef     = useRef({ live: false, startY: 0, startOffset: 0 })
  const isAnimating = useRef(false)
  const rafIdRef = useRef(0)
  const stackRef = useRef<HTMLDivElement>(null)
  const n = N_CARDS

  const snapToCurrent = useCallback(() => {
    animate(offset, -snapIdxRef.current * CARD_H, SNAP)
  }, [offset])

  const go = useCallback((dir: 1 | -1) => {
    if (isAnimating.current) return
    const next = Math.max(0, Math.min(n - 1, snapIdxRef.current + dir))
    if (next === snapIdxRef.current) return

    isAnimating.current = true
    snapIdxRef.current = next
    setRenderIdx(next)

    // 완료·중단 시 해제
    animate(offset, -next * CARD_H, SNAP).finished.finally(() => { isAnimating.current = false })
  }, [n, offset])

  // Pointer Events로 touch/mouse 통합 — setPointerCapture로 요소 밖 드래그도 추적
  useEffect(() => {
    const el = stackRef.current
    if (!el) return

    const handleStart = (y: number) => {
      if (isAnimating.current) return
      offset.stop()  // 진행 중인 되돌림 스냅을 멈추고 현재 위치에서 이어 잡기
      dragRef.current.startY      = y
      dragRef.current.startOffset = offset.get()
      dragRef.current.live        = true
      el.style.cursor = 'grabbing'
    }

    const handleMove = (y: number) => {
      if (!dragRef.current.live) return
      let delta = y - dragRef.current.startY
      const idx = snapIdxRef.current
      if (delta < 0 && idx >= n - 1) delta *= 0.2
      if (delta > 0 && idx <= 0) delta *= 0.2
      // MotionValue가 프레임 단위로 렌더를 묶어주므로 직접 set
      offset.set(dragRef.current.startOffset + delta)
    }

    const handleEnd = (y: number) => {
      if (!dragRef.current.live) return
      dragRef.current.live = false
      el.style.cursor = 'grab'
      const rawDelta = y - dragRef.current.startY
      const dir = rawDelta < 0 ? 1 : -1
      const nextIdx = snapIdxRef.current + dir
      if (Math.abs(rawDelta) > THRESHOLD && nextIdx >= 0 && nextIdx < n) {
        go(dir)
        return
      }
      snapToCurrent()
    }

    // Pointer Events (touch + mouse 통합)
    const onPointerDown = (e: PointerEvent) => {
      handleStart(e.clientY)
      el.setPointerCapture(e.pointerId)  // 요소 밖으로 나가도 move/up 계속 수신
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.live) return
      e.preventDefault()  // touch-action:none과 함께 페이지 스크롤 차단
      handleMove(e.clientY)
    }
    const onPointerUp     = (e: PointerEvent) => handleEnd(e.clientY)
    const onPointerCancel = (e: PointerEvent) => { if (dragRef.current.live) handleEnd(e.clientY) }

    // Wheel with rAF debounce
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = requestAnimationFrame(() => {
        go(e.deltaY > 0 ? 1 : -1)
      })
    }

    el.addEventListener('pointerdown',   onPointerDown)
    el.addEventListener('pointermove',   onPointerMove,   { passive: false })
    el.addEventListener('pointerup',     onPointerUp)
    el.addEventListener('pointercancel', onPointerCancel)
    el.addEventListener('wheel',         onWheel,         { passive: false })

    return () => {
      el.removeEventListener('pointerdown',   onPointerDown)
      el.removeEventListener('pointermove',   onPointerMove)
      el.removeEventListener('pointerup',     onPointerUp)
      el.removeEventListener('pointercancel', onPointerCancel)
      el.removeEventListener('wheel',         onWheel)
      cancelAnimationFrame(rafIdRef.current)
    }
  }, [go, snapToCurrent, n, offset])

  const pis = useMemo(
    () => [renderIdx - 1, renderIdx, renderIdx + 1, renderIdx + 2].filter(pi => pi >= 0 && pi < n),
    [renderIdx, n],
  )

  return (
    <div style={outerStyle}>
      <div ref={stackRef} style={stackStyle}>
        {pis.map(pi => (
          <CardStackCard
            key={pi}
            pi={pi}
            isActive={pi === renderIdx}
            offset={offset}
          />
        ))}
      </div>
    </div>
  )
}
