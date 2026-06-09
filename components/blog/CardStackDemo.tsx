'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const DARK = '#16181f'
const HANDLE_H = 20
const HEADER_H = 54
const PROGRESS_H = 40
const DARK_H = HANDLE_H + HEADER_H + PROGRESS_H  // 114
const WHITE_H = 400
const CARD_H = DARK_H + WHITE_H   // 514
const PEEK = HANDLE_H             // 20 — 다음 카드 핸들만 노출
const STACK_H = CARD_H + PEEK     // 534
const THRESHOLD = 70
const ANIM_MS = 360
const MAX_SHRINK_Y = 120

const getScaleFromTy = (ty: number): number => {
  if (ty >= 0) return 1
  const progress = Math.min(-ty / MAX_SHRINK_Y, 1)
  return 1 - 0.2 * progress
}

type CardItem = { color: string; letter: string; name: string; score: string }
type CardData = {
  id: number
  title: string
  metricLabel: string
  metricValue: string
  metricColor: string
  metricDesc: string
  listTitle: string
  list: CardItem[]
}

const CARDS: CardData[] = [
  {
    id: 1,
    title: '카드를 위아래로\n드래그해보세요',
    metricLabel: '인터랙션',
    metricValue: '3가지 방식',
    metricColor: '#4b94ff',
    metricDesc: '터치, 마우스, 휠 모두 지원해요',
    listTitle: '지원 방식',
    list: [
      { color: '#ef4444', letter: 'T', name: '터치 드래그', score: '최우선' },
      { color: '#3b82f6', letter: 'M', name: '마우스 드래그', score: '지원' },
      { color: '#8b5cf6', letter: 'W', name: '마우스 휠', score: '지원' },
    ],
  },
  {
    id: 2,
    title: '70px 초과 드래그하면\n카드가 전환돼요',
    metricLabel: '드래그 임계값',
    metricValue: '70px',
    metricColor: '#4b94ff',
    metricDesc: '미달 시 원래 위치로 snap돼요',
    listTitle: '임계값 동작',
    list: [
      { color: '#10b981', letter: '↑', name: '위로 70px+', score: '다음 카드' },
      { color: '#f59e0b', letter: '↓', name: '아래로 70px+', score: '이전 카드' },
      { color: '#6b7280', letter: '~', name: '미달 드래그', score: '원위치' },
    ],
  },
  {
    id: 3,
    title: '경계에서는\n저항감이 생겨요',
    metricLabel: '감쇠 계수',
    metricValue: '× 0.2',
    metricColor: '#4b94ff',
    metricDesc: '첫·마지막 카드 경계에서 드래그가 감쇠돼요',
    listTitle: '저항 적용 구간',
    list: [
      { color: '#ef4444', letter: '1', name: '첫 카드 위 드래그', score: '× 0.2' },
      { color: '#ef4444', letter: 'N', name: '마지막 카드 아래', score: '× 0.2' },
      { color: '#22c55e', letter: '∞', name: '일반 구간', score: '× 1.0' },
    ],
  },
]

export default function CardStackDemo() {
  const [renderIdx, setRenderIdx] = useState(0)

  const snapIdxRef     = useRef(0)
  const offsetRef      = useRef(0)
  const startOffsetRef = useRef(0)
  const startYRef      = useRef(0)
  const liveRef        = useRef(false)
  const isAnimating    = useRef(false)
  const cardRefs       = useRef(new Map<number, HTMLDivElement>())
  // pi별 stable ref 콜백 캐시 — inline arrow는 매 렌더에 새 함수가 생겨
  // React가 null→el 재호출하면서 applyTransforms(true)의 transition을 캔슬함
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

  // transition:none → transition:Xms 전환 시 브라우저가 같은 프레임으로 인식해
  // 애니메이션을 건너뛰는 현상 방지 — offsetHeight 참조로 강제 reflow 유발
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

  // 모든 포인터/터치/휠 이벤트를 native listener로 — React synthetic은
  // touchmove를 passive 등록해 모바일 스크롤이 우선권을 가져 onTouchEnd 누락 발생
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
      if (delta > 0 && idx <= 0) delta *= 0.2
      offsetRef.current = startOffsetRef.current + delta
      applyTransforms(false)
    }

    const handleEnd = (y: number) => {
      if (!liveRef.current) return
      liveRef.current = false
      el.style.cursor = 'grab'
      const delta = y - startYRef.current
      if (Math.abs(delta) > THRESHOLD) {
        go(delta < 0 ? 1 : -1)
      } else {
        offsetRef.current = -snapIdxRef.current * CARD_H
        forceReflow()
        applyTransforms(true)
      }
    }

    // Touch
    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientY)
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()  // passive:false 필수 — 페이지 스크롤 차단
      handleMove(e.touches[0].clientY)
    }
    const onTouchEnd   = (e: TouchEvent) => handleEnd(e.changedTouches[0].clientY)

    // Mouse (mousemove/mouseup은 window에 — 요소 밖으로 드래그해도 추적)
    const onMouseDown  = (e: MouseEvent) => handleStart(e.clientY)
    const onMouseMove  = (e: MouseEvent) => { if (liveRef.current) handleMove(e.clientY) }
    const onMouseUp    = (e: MouseEvent) => { if (liveRef.current) handleEnd(e.clientY) }

    // Wheel with rAF debounce
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = requestAnimationFrame(() => {
        go(e.deltaY > 0 ? 1 : -1)
      })
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
      maxWidth: '400px',
      margin: '0 auto',
      background: DARK,
      borderRadius: '20px',
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
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* 드래그 핸들 — peek 시 이 부분만 보임 */}
              <div style={{
                height: HANDLE_H,
                background: DARK,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: 36, height: 4,
                  borderRadius: 9999,
                  background: '#3d4055',
                }} />
              </div>

              {/* 헤더 */}
              <div style={{ background: DARK, flexShrink: 0 }}>
                <div style={{
                  height: HEADER_H,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '0 20px',
                }}>
                  <button style={{
                    position: 'absolute', left: 20,
                    width: 28, height: 28,
                    background: 'none', border: 'none', padding: 0,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ffffff',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span style={{ color: '#ffffff', fontSize: 15, fontWeight: 600 }}>
                    카드 스택 UI
                  </span>
                </div>
                <div style={{
                  height: PROGRESS_H,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                }}>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>카드 스택 UI</span>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>{pi + 1}/{n}</span>
                </div>
              </div>

              {/* 콘텐츠 */}
              <div style={{
                flex: 1,
                background: DARK,
                borderRadius: '20px 20px 0 0',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 24px 0',
                boxSizing: 'border-box',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <button style={{
                  position: 'absolute', top: 24, right: 24,
                  width: 32, height: 32,
                  background: '#2a2d3a', border: '1px solid #3d4055',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#9ca3af', padding: 0,
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>

                <h2 style={{
                  margin: 0, fontSize: 22, fontWeight: 800,
                  color: '#f9fafb', lineHeight: 1.35,
                  whiteSpace: 'pre-line', paddingRight: 48,
                }}>
                  {card.title}
                </h2>

                <div style={{
                  flex: 1,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 6, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{card.metricLabel}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: card.metricColor }}>{card.metricValue}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>{card.metricDesc}</div>
                </div>

                <div style={{ paddingBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb', marginBottom: 8 }}>
                    {card.listTitle}
                  </div>
                  <div style={{ height: 1, background: '#2d3040', marginBottom: 8 }} />
                  {card.list.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10, height: 40,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#4b94ff', minWidth: 16 }}>
                        {i + 1}
                      </span>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: item.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                      }}>
                        {item.letter}
                      </div>
                      <span style={{ flex: 1, fontSize: 14, color: '#d1d5db' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#f3f4f6' }}>
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
