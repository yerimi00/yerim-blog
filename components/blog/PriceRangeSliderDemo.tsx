'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const MARKS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
const THUMB_W = 28

function toFraction(idx: number) {
  return idx / (MARKS.length - 1)
}

function formatPrice(v: number) {
  return v >= 100 ? `${v / 100}억` : `${v}만원`
}

export default function PriceRangeSliderDemo() {
  const [markIdx, setMarkIdx] = useState(9) // 100만원
  const [selected, setSelected] = useState(false)
  const [bubbleLeft, setBubbleLeft] = useState('50%')
  const trackRef = useRef<HTMLDivElement>(null)

  const fraction = toFraction(markIdx)

  const computeBubble = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const w = el.clientWidth
    const usable = Math.max(0, w - THUMB_W)
    const px = THUMB_W / 2 + usable * fraction
    setBubbleLeft(`${Math.min(w - THUMB_W / 2, Math.max(THUMB_W / 2, px))}px`)
  }, [fraction])

  useEffect(() => {
    computeBubble()
    const ro = new ResizeObserver(computeBubble)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [computeBubble])

  const pct = selected ? fraction * 100 : 0

  return (
    <div style={{
      width: 300, margin: '0 auto',
      fontFamily: 'Pretendard, sans-serif',
      padding: '0 4px',
    }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted, #6b7280)' }}>가격 범위</span>
      </div>

      <div ref={trackRef} style={{ position: 'relative', height: 44, marginBottom: 4 }}>
        {/* track bg */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 6, borderRadius: 3,
          background: 'var(--border, #e5e7eb)',
          transform: 'translateY(-50%)',
        }} />
        {/* fill */}
        <div style={{
          position: 'absolute', top: '50%', left: 0,
          height: 6, borderRadius: 3,
          width: `${pct}%`,
          background: 'var(--accent)',
          transform: 'translateY(-50%)',
          transition: 'width 0.1s',
        }} />

        {/* bubble */}
        {selected && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: bubbleLeft,
            transform: 'translateX(-50%)',
            background: 'var(--accent)', color: '#fff',
            fontSize: 12, fontWeight: 700,
            padding: '4px 8px', borderRadius: 'var(--radius-md)',
            whiteSpace: 'nowrap',
            marginBottom: 4,
            pointerEvents: 'none',
          }}>
            {formatPrice(MARKS[markIdx])}
          </div>
        )}

        <input
          type="range"
          min={0}
          max={MARKS.length - 1}
          value={markIdx}
          onChange={e => setMarkIdx(Number(e.target.value))}
          onMouseDown={() => setSelected(true)}
          onTouchStart={() => setSelected(true)}
          style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            width: '100%', margin: 0, padding: 0,
            opacity: 0, cursor: 'pointer', height: 44,
            transform: 'translateY(-50%)',
          }}
        />

        {/* thumb visual */}
        <div style={{
          position: 'absolute', top: '50%',
          left: `calc(${pct}% - ${THUMB_W / 2}px)`,
          width: THUMB_W, height: THUMB_W,
          borderRadius: '50%',
          background: selected ? 'var(--accent)' : 'var(--border)',
          border: '3px solid var(--surface)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transform: 'translateY(-50%)',
          transition: 'background 0.2s, left 0.05s',
          pointerEvents: 'none',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted, #9ca3af)', marginTop: 4 }}>
        <span>10만원</span>
        <span>1000만원</span>
      </div>

      <div style={{
        marginTop: 16, padding: '12px 14px',
        background: 'var(--surface, #f9fafb)',
        border: '1px solid var(--border, #e5e7eb)',
        borderRadius: 'var(--radius-xl)',
        fontSize: 14, color: 'var(--text, #111)',
      }}>
        {selected
          ? <><strong style={{ color: 'var(--accent)' }}>{formatPrice(MARKS[markIdx])}</strong> 이하 업체 검색</>
          : <span style={{ color: 'var(--text-muted, #6b7280)' }}>슬라이더를 움직여 가격을 설정하세요</span>}
      </div>
    </div>
  )
}
