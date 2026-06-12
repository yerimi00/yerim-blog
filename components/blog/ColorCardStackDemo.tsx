'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

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

const getScaleFromTy = (ty: number): number => {
  if (ty >= 0) return 1
  const progress = Math.min(-ty / MAX_SHRINK_Y, 1)
  return 1 - 0.2 * progress
}

export default function ColorCardStackDemo() {
  const [renderIdx, setRenderIdx] = useState(0)

  const snapIdxRef     = useRef(0)
  const offsetRef      = useRef(0)
  const startOffsetRef = useRef(0)
  const startYRef      = useRef(0)
  const liveRef        = useRef(false)
  const isAnimating    = useRef(false)
  const cardRefs       = useRef(new Map<number, HTMLDivElement>())
  const cardRefCbs     = useRef(new Map<number, (el: HTMLDivElement | null) => void>())
  const rafIdRef       = useRef(0)
  const stackRef       = useRef<HTMLDivElement>(null)
  const n = CARDS.length

  const getCardRef = useCallback((pi: number) => {
    if (!cardRefCbs.current.has(pi)) {
      cardRefCbs.current.set(pi, (el: HTMLDivElement | null) => {
        if (el) {
          cardRefs.current.set(pi, el)
          const ty = offsetRef.current + pi * CARD_H
          el.style.transition = 'none'
          el.style.transform = `translateY(${ty}px) scale(${getScaleFromTy(ty)})`
        } else {
          cardRefs.current.delete(pi)
          cardRefCbs.current.delete(pi)
        }
      })
    }
    return cardRefCbs.current.get(pi)!
  }, [])

  const applyTransforms = useCallback((withTransition: boolean) => {
    const offset = offsetRef.current
    cardRefs.current.forEach((el, pi) => {
      const ty = offset + pi * CARD_H
      el.style.transition = withTransition
        ? `transform ${ANIM_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
        : 'none'
      el.style.transform = `translateY(${ty}px) scale(${getScaleFromTy(ty)})`
    })
  }, [])

  const forceReflow = useCallback(() => {
    cardRefs.current.forEach(el => { void el.offsetHeight })
  }, [])

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
    setTimeout(() => { isAnimating.current = false }, 500)
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
      if (Math.abs(delta) > THRESHOLD) {
        const dir = delta < 0 ? 1 : -1
        const next = snapIdxRef.current + dir
        if (next >= 0 && next < n) {
          go(dir)
        } else {
          offsetRef.current = -snapIdxRef.current * CARD_H
          forceReflow()
          applyTransforms(true)
        }
      } else {
        offsetRef.current = -snapIdxRef.current * CARD_H
        forceReflow()
        applyTransforms(true)
      }
    }

    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientY)
    const onTouchMove  = (e: TouchEvent) => { e.preventDefault(); handleMove(e.touches[0].clientY) }
    const onTouchEnd   = (e: TouchEvent) => handleEnd(e.changedTouches[0].clientY)
    const onMouseDown  = (e: MouseEvent) => handleStart(e.clientY)
    const onMouseMove  = (e: MouseEvent) => { if (liveRef.current) handleMove(e.clientY) }
    const onMouseUp    = (e: MouseEvent) => { if (liveRef.current) handleEnd(e.clientY) }
    const onWheel      = (e: WheelEvent) => {
      e.preventDefault()
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = requestAnimationFrame(() => go(e.deltaY > 0 ? 1 : -1))
    }

    el.addEventListener('touchstart',  onTouchStart, { passive: true })
    el.addEventListener('touchmove',   onTouchMove,  { passive: false })
    el.addEventListener('touchend',    onTouchEnd,   { passive: true })
    el.addEventListener('touchcancel', onTouchEnd,   { passive: true })
    el.addEventListener('mousedown',   onMouseDown)
    el.addEventListener('wheel',       onWheel,      { passive: false })
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)

    return () => {
      el.removeEventListener('touchstart',  onTouchStart)
      el.removeEventListener('touchmove',   onTouchMove)
      el.removeEventListener('touchend',    onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      el.removeEventListener('mousedown',   onMouseDown)
      el.removeEventListener('wheel',       onWheel)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
      cancelAnimationFrame(rafIdRef.current)
    }
  }, [go, applyTransforms, forceReflow, n])

  const pis = [renderIdx - 1, renderIdx, renderIdx + 1, renderIdx + 2]
    .filter(pi => pi >= 0 && pi < n)

  return (
    <div style={{
      maxWidth: '360px',
      margin: '0 auto',
      overflow: 'hidden',
      height: STACK_H,
      fontFamily: 'Pretendard, sans-serif',
    }}>
      <div
        ref={stackRef}
        style={{
          position: 'relative',
          height: STACK_H,
          overflow: 'hidden',
          transform: 'translateZ(0)',
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'grab',
        }}
      >
        {pis.map(pi => {
          const card = CARDS[pi]
          return (
            <div
              key={pi}
              ref={getCardRef(pi)}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: CARD_H,
                willChange: 'transform',
                pointerEvents: pi === renderIdx ? 'auto' : 'none',
                paddingBottom: 8,
                boxSizing: 'border-box',
              }}
            >
              <div style={{
                height: '100%',
                background: card.color,
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 12,
                  width: 36, height: 4,
                  borderRadius: 9999,
                  background: 'rgba(255,255,255,0.45)',
                }} />

                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: 12, opacity: 0.65, letterSpacing: '0.14em', marginBottom: 10 }}>
                    {card.sub}
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>
                    {card.label}
                  </div>
                  <div style={{ marginTop: 14, fontSize: 13, opacity: 0.55 }}>
                    {pi + 1} / {n}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
