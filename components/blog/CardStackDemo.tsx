'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { CSSProperties } from 'react'
import CardStackCard from './CardStackCard'

const DARK = '#16181f'
const HANDLE_H = 20
export const CARD_H = 514
const PEEK = HANDLE_H
const STACK_H = CARD_H + PEEK     // 534
const THRESHOLD = 70
const ANIM_MS = 360
const MAX_SHRINK_Y = 120

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

const getScaleFromTy = (ty: number): number => {
  if (ty >= 0) return 1
  const progress = Math.min(-ty / MAX_SHRINK_Y, 1)
  return 1 - 0.2 * progress
}

const N_CARDS = 3

export default function CardStackDemo() {
  const [renderIdx, setRenderIdx] = useState(0)

  const snapIdxRef  = useRef(0)
  const offsetRef   = useRef(0)
  const dragRef     = useRef({ live: false, startY: 0, startOffset: 0 })
  const isAnimating = useRef(false)
  const cardRefs       = useRef(new Map<number, HTMLDivElement>())
  // pi별 stable ref 콜백 캐시 — inline arrow는 매 렌더에 새 함수가 생겨
  // React가 null→el 재호출하면서 applyTransforms(true)의 transition을 캔슬함
  const cardRefCbs     = useRef(new Map<number, (el: HTMLDivElement | null) => void>())
  const rafIdRef       = useRef(0)
  const stackRef       = useRef<HTMLDivElement>(null)
  const n = N_CARDS

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

  // transition:none → transition:Xms 전환 시 브라우저가 같은 프레임으로 인식해
  // 애니메이션을 건너뛰는 현상 방지 — offsetHeight 참조로 강제 reflow 유발
  // 어느 한 요소만 읽어도 global layout이 발생하므로 첫 번째 요소만 사용
  const forceReflow = useCallback(() => {
    const first = cardRefs.current.values().next().value
    if (first) void first.offsetHeight
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

    // transitionend로 정확히 해제 — 카드 ref가 없으면 ANIM_MS fallback
    const release = () => { isAnimating.current = false }
    const el = cardRefs.current.get(next)
    if (el) {
      el.addEventListener('transitionend',    release, { once: true })
      el.addEventListener('transitioncancel', release, { once: true })
    } else {
      setTimeout(release, ANIM_MS)
    }
  }, [n, applyTransforms, forceReflow])

  // Pointer Events로 touch/mouse 통합 — setPointerCapture로 요소 밖 드래그도 추적
  useEffect(() => {
    const el = stackRef.current
    if (!el) return

    const handleStart = (y: number) => {
      if (isAnimating.current) return
      dragRef.current.startY      = y
      dragRef.current.startOffset = offsetRef.current
      dragRef.current.live        = true
      el.style.cursor = 'grabbing'
    }

    const handleMove = (y: number) => {
      if (!dragRef.current.live) return
      let delta = y - dragRef.current.startY
      const idx = snapIdxRef.current
      if (delta < 0 && idx >= n - 1) delta *= 0.2
      if (delta > 0 && idx <= 0) delta *= 0.2
      offsetRef.current = dragRef.current.startOffset + delta
      // 프레임당 DOM write 최대 1회 — pointermove는 1프레임에 여러 번 올 수 있음
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = 0
          applyTransforms(false)
        })
      }
    }

    const handleEnd = (y: number) => {
      if (!dragRef.current.live) return
      dragRef.current.live = false
      el.style.cursor = 'grab'
      // pending drag rAF를 flush — 마지막 offset이 반영된 뒤 snap 판단
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = 0
        applyTransforms(false)
      }
      const rawDelta = y - dragRef.current.startY
      const dir = rawDelta < 0 ? 1 : -1
      const nextIdx = snapIdxRef.current + dir
      if (Math.abs(rawDelta) > THRESHOLD && nextIdx >= 0 && nextIdx < n) {
        go(dir)
        return
      }
      // 임계값 미달이거나 경계(첫·마지막 카드) — 원래 위치로 snap-back
      offsetRef.current = -snapIdxRef.current * CARD_H
      forceReflow()
      applyTransforms(true)
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
  }, [go, applyTransforms, forceReflow, n])

  const pis = [renderIdx - 1, renderIdx, renderIdx + 1, renderIdx + 2]
    .filter(pi => pi >= 0 && pi < n)

  return (
    <div style={outerStyle}>
      <div ref={stackRef} style={stackStyle}>
        {pis.map(pi => (
          <CardStackCard
            key={pi}
            pi={pi}
            isActive={pi === renderIdx}
            getCardRef={getCardRef}
          />
        ))}
      </div>
    </div>
  )
}
