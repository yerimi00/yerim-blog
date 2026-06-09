'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const CARD_W = 300
const PEEK = 24
const STACK_W = CARD_W + PEEK
const CARD_H = 420
const THRESHOLD = 60
const ANIM_MS = 320

const CARDS = [
  { bg: '#6366f1', label: '카드 1' },
  { bg: '#ec4899', label: '카드 2' },
  { bg: '#f59e0b', label: '카드 3' },
  { bg: '#10b981', label: '카드 4' },
]

const getScaleFromTx = (tx: number): number => {
  if (tx <= 0) return 1
  const p = Math.min(tx / CARD_W, 1)
  return 1 - 0.08 * p
}

export default function HorizontalCardSwipeDemo() {
  const [renderIdx, setRenderIdx] = useState(0)

  const snapIdxRef     = useRef(0)
  const offsetRef      = useRef(0)
  const startOffsetRef = useRef(0)
  const startXRef      = useRef(0)
  const liveRef        = useRef(false)
  const isAnimating    = useRef(false)
  const cardRefs       = useRef(new Map<number, HTMLDivElement>())
  const cardRefCbs     = useRef(new Map<number, (el: HTMLDivElement | null) => void>())
  const stackRef       = useRef<HTMLDivElement>(null)
  const n = CARDS.length

  const getCardRef = useCallback((pi: number) => {
    if (!cardRefCbs.current.has(pi)) {
      cardRefCbs.current.set(pi, (el: HTMLDivElement | null) => {
        if (el) {
          cardRefs.current.set(pi, el)
          const tx = offsetRef.current + pi * CARD_W
          el.style.transition = 'none'
          el.style.transform = `translateX(${tx}px) scale(${getScaleFromTx(tx)})`
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
      const tx = offset + pi * CARD_W
      el.style.transition = withTransition
        ? `transform ${ANIM_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
        : 'none'
      el.style.transform = `translateX(${tx}px) scale(${getScaleFromTx(tx)})`
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
    offsetRef.current = -next * CARD_W

    forceReflow()
    applyTransforms(true)
    setRenderIdx(next)
    setTimeout(() => { isAnimating.current = false }, 500)
  }, [n, applyTransforms, forceReflow])

  useEffect(() => {
    const el = stackRef.current
    if (!el) return

    const handleStart = (x: number) => {
      if (isAnimating.current) return
      startXRef.current = x
      startOffsetRef.current = offsetRef.current
      liveRef.current = true
      el.style.cursor = 'grabbing'
    }

    const handleMove = (x: number) => {
      if (!liveRef.current) return
      let delta = x - startXRef.current
      const idx = snapIdxRef.current
      if (delta < 0 && idx >= n - 1) delta *= 0.2
      if (delta > 0 && idx <= 0)     delta *= 0.2
      offsetRef.current = startOffsetRef.current + delta
      applyTransforms(false)
    }

    const handleEnd = (x: number) => {
      if (!liveRef.current) return
      liveRef.current = false
      el.style.cursor = 'grab'
      const delta = x - startXRef.current
      if (Math.abs(delta) > THRESHOLD) {
        const dir = delta < 0 ? 1 : -1
        const next = snapIdxRef.current + dir
        if (next >= 0 && next < n) {
          go(dir)
        } else {
          offsetRef.current = -snapIdxRef.current * CARD_W
          forceReflow()
          applyTransforms(true)
        }
      } else {
        offsetRef.current = -snapIdxRef.current * CARD_W
        forceReflow()
        applyTransforms(true)
      }
    }

    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX)
    const onTouchMove  = (e: TouchEvent) => { e.preventDefault(); handleMove(e.touches[0].clientX) }
    const onTouchEnd   = (e: TouchEvent) => handleEnd(e.changedTouches[0].clientX)
    const onMouseDown  = (e: MouseEvent) => handleStart(e.clientX)
    const onMouseMove  = (e: MouseEvent) => { if (liveRef.current) handleMove(e.clientX) }
    const onMouseUp    = (e: MouseEvent) => { if (liveRef.current) handleEnd(e.clientX) }
    const onKeyDown    = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1) }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    }

    el.addEventListener('touchstart',  onTouchStart, { passive: true })
    el.addEventListener('touchmove',   onTouchMove,  { passive: false })
    el.addEventListener('touchend',    onTouchEnd,   { passive: true })
    el.addEventListener('touchcancel', onTouchEnd,   { passive: true })
    el.addEventListener('mousedown',   onMouseDown)
    el.addEventListener('keydown',     onKeyDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)

    return () => {
      el.removeEventListener('touchstart',  onTouchStart)
      el.removeEventListener('touchmove',   onTouchMove)
      el.removeEventListener('touchend',    onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      el.removeEventListener('mousedown',   onMouseDown)
      el.removeEventListener('keydown',     onKeyDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [go, applyTransforms, forceReflow, n])

  const pis = [renderIdx - 1, renderIdx, renderIdx + 1, renderIdx + 2]
    .filter(pi => pi >= 0 && pi < n)

  return (
    <div style={{
      width: STACK_W,
      maxWidth: '100%',
      margin: '0 auto',
      height: CARD_H,
      fontFamily: 'Pretendard, sans-serif',
    }}>
      <div
        ref={stackRef}
        tabIndex={0}
        style={{
          position: 'relative',
          width: STACK_W,
          height: CARD_H,
          overflow: 'hidden',
          transform: 'translateZ(0)',
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'grab',
          outline: 'none',
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
                top: 0,
                left: 0,
                width: CARD_W,
                height: CARD_H,
                willChange: 'transform',
                pointerEvents: pi === renderIdx ? 'auto' : 'none',
                paddingRight: 12,
                boxSizing: 'border-box',
              }}
            >
              <div style={{
                height: '100%',
                background: card.bg,
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>
                  {card.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
