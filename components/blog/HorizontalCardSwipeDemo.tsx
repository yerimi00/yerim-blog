'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { CSSProperties } from 'react'

const CARD_W = 300
const PEEK = 24
const STACK_W = CARD_W + PEEK
const CARD_H = 420
const THRESHOLD = 60
const ANIM_MS = 320

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
  const offsetRef   = useRef(0)
  const dragRef     = useRef({ live: false, startX: 0, startOffset: 0 })
  const isAnimating = useRef(false)
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([])
  const stackRef    = useRef<HTMLDivElement>(null)
  const n = CARDS.length

  const applyTransforms = useCallback((withTransition: boolean) => {
    const offset = offsetRef.current
    cardRefs.current.forEach((el, pi) => {
      if (!el) return
      const tx = offset + pi * CARD_W
      el.style.transition = withTransition
        ? `transform ${ANIM_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
        : 'none'
      el.style.transform = `translateX(${tx}px) scale(${getScaleFromTx(tx)})`
    })
  }, [])

  const snapToCurrent = useCallback(() => {
    offsetRef.current = -snapIdxRef.current * CARD_W
    applyTransforms(true)
  }, [applyTransforms])

  const go = useCallback((dir: 1 | -1) => {
    if (isAnimating.current) return
    const next = Math.max(0, Math.min(n - 1, snapIdxRef.current + dir))
    if (next === snapIdxRef.current) return

    isAnimating.current = true
    snapIdxRef.current = next
    offsetRef.current = -next * CARD_W

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
  }, [n, applyTransforms])

  useEffect(() => {
    const el = stackRef.current
    if (!el) return

    const handleStart = (x: number) => {
      if (isAnimating.current) return
      dragRef.current.startX      = x
      dragRef.current.startOffset = offsetRef.current
      dragRef.current.live        = true
      el.style.cursor = 'grabbing'
    }

    const handleMove = (x: number) => {
      if (!dragRef.current.live) return
      let delta = x - dragRef.current.startX
      const idx = snapIdxRef.current
      if (delta < 0 && idx >= n - 1) delta *= 0.2
      if (delta > 0 && idx <= 0)     delta *= 0.2
      offsetRef.current = dragRef.current.startOffset + delta
      applyTransforms(false)
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
  }, [go, applyTransforms, snapToCurrent, n])

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
            <div
              key={pi}
              ref={(el) => {
                cardRefs.current[pi] = el
                // 신규 mount 시에만 초기 위치 설정 — 기존 카드 re-render 시 애니메이션 유지
                if (el && !el.style.transform) {
                  const tx = offsetRef.current + pi * CARD_W
                  el.style.transition = 'none'
                  el.style.transform = `translateX(${tx}px) scale(${getScaleFromTx(tx)})`
                }
              }}
              style={{ ...cardWrapperBase, pointerEvents: pi === renderIdx ? 'auto' : 'none' }}
            >
              <div style={{ ...cardInnerBase, background: card.bg }}>
                <span style={labelStyle}>{card.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
