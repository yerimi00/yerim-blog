'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { CSSProperties } from 'react'

const CARD_H = 460
const PEEK = 20
const STACK_H = CARD_H + PEEK
const THRESHOLD = 70
const ANIM_MS = 360
const MAX_SHRINK_Y = 120

const CARDS = [
  { color: '#3b82f6', label: '첫 번째', sub: 'CARD 01' },
  { color: '#2170e4', label: '두 번째', sub: 'CARD 02' },
  { color: '#575e70', label: '세 번째', sub: 'CARD 03' },
]

// ── styles ───────────────────────────────────────────────────────────────────

const outerStyle: CSSProperties = {
  maxWidth: '360px',
  margin: '0 auto',
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

const cardWrapperBase: CSSProperties = {
  position: 'absolute',
  top: 0, left: 0, right: 0,
  height: CARD_H,
  willChange: 'transform',
  paddingBottom: 8,
  boxSizing: 'border-box',
}

const cardInnerBase: CSSProperties = {
  height: '100%',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}

const handlePillStyle: CSSProperties = {
  position: 'absolute', top: 12,
  width: 36, height: 4,
  borderRadius: 9999,
  background: 'rgba(255,255,255,0.45)',
}

const textContainerStyle: CSSProperties = { textAlign: 'center', color: '#fff' }
const subTextStyle:       CSSProperties = { fontSize: 12, opacity: 0.65, letterSpacing: '0.14em', marginBottom: 10 }
const labelStyle:         CSSProperties = { fontSize: 40, fontWeight: 800, lineHeight: 1 }
const counterStyle:       CSSProperties = { marginTop: 14, fontSize: 13, opacity: 0.55 }

// ─────────────────────────────────────────────────────────────────────────────

const getScaleFromTy = (ty: number): number => {
  if (ty >= 0) return 1
  const progress = Math.min(-ty / MAX_SHRINK_Y, 1)
  return 1 - 0.2 * progress
}

export default function ColorCardStackDemo() {
  const [renderIdx, setRenderIdx] = useState(0)

  const snapIdxRef  = useRef(0)
  const offsetRef   = useRef(0)
  const startOffsetRef = useRef(0)
  const startYRef      = useRef(0)
  const liveRef        = useRef(false)
  const isAnimating = useRef(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafIdRef = useRef(0)
  const stackRef = useRef<HTMLDivElement>(null)
  const n = CARDS.length

  const applyTransforms = useCallback((withTransition: boolean) => {
    const offset = offsetRef.current
    cardRefs.current.forEach((el, pi) => {
      if (!el) return
      const ty = offset + pi * CARD_H
      el.style.transition = withTransition
        ? `transform ${ANIM_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
        : 'none'
      el.style.transform = `translateY(${ty}px) scale(${getScaleFromTy(ty)})`
    })
  }, [])

  const forceReflow = useCallback(() => {
    const first = cardRefs.current.find(el => el != null)
    if (first) void first.offsetHeight
  }, [])

  const snapToCurrent = useCallback(() => {
    offsetRef.current = -snapIdxRef.current * CARD_H
    forceReflow()
    applyTransforms(true)
  }, [applyTransforms, forceReflow])

  const go = useCallback((dir: 1 | -1) => {
    if (isAnimating.current) return
    const next = Math.max(0, Math.min(n - 1, snapIdxRef.current + dir))
    if (next === snapIdxRef.current) return

    isAnimating.current = true
    snapIdxRef.current = next
    offsetRef.current = -next * CARD_H

    forceReflow()
    applyTransforms(true)
    setRenderIdx(next)

    const release = () => { isAnimating.current = false }
    const card = cardRefs.current[next]
    if (card) {
      card.addEventListener('transitionend',    release, { once: true })
      card.addEventListener('transitioncancel', release, { once: true })
    } else {
      setTimeout(release, ANIM_MS)
    }
  }, [n, applyTransforms, forceReflow])

  useEffect(() => {
    const el = stackRef.current
    if (!el) return

    const handleStart = (y: number) => {
      if (isAnimating.current) return
      startYRef.current = y
      startOffsetRef.current = offsetRef.current
      liveRef.current = true
      el.style.cursor = 'grabbing'
    }

    const handleMove = (y: number) => {
      if (!liveRef.current) return
      let delta = y - startYRef.current
      const idx = snapIdxRef.current
      if (delta < 0 && idx >= n - 1) delta *= 0.2
      if (delta > 0 && idx <= 0)     delta *= 0.2
      offsetRef.current = startOffsetRef.current + delta
      applyTransforms(false)
    }

    const handleEnd = (y: number) => {
      if (!liveRef.current) return
      liveRef.current = false
      el.style.cursor = 'grab'
      const delta = y - startYRef.current
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
      handleStart(e.clientY)
      el.setPointerCapture(e.pointerId)
    }
    const onPointerMove   = (e: PointerEvent) => {
      if (!liveRef.current) return
      e.preventDefault()
      handleMove(e.clientY)
    }
    const onPointerUp     = (e: PointerEvent) => handleEnd(e.clientY)
    const onPointerCancel = (e: PointerEvent) => { if (liveRef.current) handleEnd(e.clientY) }
    const onWheel         = (e: WheelEvent) => {
      e.preventDefault()
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = requestAnimationFrame(() => go(e.deltaY > 0 ? 1 : -1))
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
  }, [go, applyTransforms, forceReflow, snapToCurrent, n])

  const pis = [renderIdx - 1, renderIdx, renderIdx + 1, renderIdx + 2]
    .filter(pi => pi >= 0 && pi < n)

  return (
    <div style={outerStyle}>
      <div ref={stackRef} style={stackStyle}>
        {pis.map(pi => {
          const card = CARDS[pi]
          return (
            <div
              key={pi}
              ref={(el) => { cardRefs.current[pi] = el }}
              style={{ ...cardWrapperBase, pointerEvents: pi === renderIdx ? 'auto' : 'none' }}
            >
              <div style={{ ...cardInnerBase, background: card.color }}>
                <div style={handlePillStyle} />
                <div style={textContainerStyle}>
                  <div style={subTextStyle}>{card.sub}</div>
                  <div style={labelStyle}>{card.label}</div>
                  <div style={counterStyle}>{pi + 1} / {n}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
