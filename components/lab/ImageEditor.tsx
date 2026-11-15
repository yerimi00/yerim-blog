'use client'

// 카드 이미지 편집 화면 (사진 편집 앱의 자르기 화면 패턴): 칸은 그대로 두고 그 안에서 사진을 드래그로 옮기고,
// 휠·슬라이더로 크기, 아래 도구 막대로 회전·반전·초기화. 위쪽 취소/완료 — 완료해야 카드에 반영된다
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { TbFlipVertical, TbRestore, TbRotateClockwise2, TbZoomIn, TbZoomOut } from 'react-icons/tb'
import { fastTween } from '@/components/motion/presets'
import { DEFAULT_VIEW, H, W, type Box, type ImageView } from './card-designs'

const ZOOM_MIN = 0.5
const ZOOM_MAX = 3
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

type Props = {
  title: string
  initial: ImageView
  /** 이 view로 카드를 그리고, 이미지가 그려진 칸을 돌려준다 */
  render: (canvas: HTMLCanvasElement, view: ImageView) => Box | null
  onDone: (view: ImageView) => void
  onCancel: () => void
}

export default function ImageEditor({ title, initial, render, onDone, onCancel }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [view, setView] = useState(initial)
  const [box, setBox] = useState<Box | null>(null)
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const patch = (p: Partial<ImageView>) => setView((v) => ({ ...v, ...p }))

  useEffect(() => {
    if (ref.current) setBox(render(ref.current, view))
  }, [render, view])

  // ESC = 취소, 열려 있는 동안 뒤 페이지 스크롤 막기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onCancel])

  // 휠 확대·축소. React onWheel은 passive라 페이지 스크롤을 못 막아서 직접 붙인다
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setView((v) => ({ ...v, zoom: clamp(v.zoom * Math.exp(-e.deltaY * 0.0015), ZOOM_MIN, ZOOM_MAX) }))
    }
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [])

  // ponytail: 한 손가락 드래그만 받는다. 모바일 두 손가락 핀치는 없음 → 크기는 아래 슬라이더
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, x: view.x, y: view.y }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const start = drag.current
    if (!start || !box) return
    // 화면 px → 캔버스 px → 칸 대비 비율 (손가락과 사진이 같은 거리로 움직이게)
    const k = W / e.currentTarget.getBoundingClientRect().width
    patch({
      x: clamp(start.x + ((e.clientX - start.px) * k) / box.w, -1, 1),
      y: clamp(start.y + ((e.clientY - start.py) * k) / box.h, -1, 1),
    })
  }
  const endDrag = () => { drag.current = null }

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} 이미지 편집`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fastTween}
      style={{
        position: 'fixed',
        inset: 0,
        // 방명록 FAB(떠 있는 버튼)보다 위
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0,0,0,0.96)',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
        <button type="button" onClick={onCancel} style={textButton}>취소</button>
        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{title}</span>
        <button type="button" onClick={() => onDone(view)} style={{ ...textButton, color: 'var(--accent)', fontWeight: 700 }}>완료</button>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem' }}>
        {/* 위아래 막대(약 230px)를 뺀 높이와 화면 너비 중 작은 쪽에 4:5로 맞춘다 */}
        <div style={{ position: 'relative', width: `min(100%, calc((100dvh - 230px) * ${W / H}))`, aspectRatio: `${W} / ${H}` }}>
          <canvas
            ref={ref}
            width={W}
            height={H}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={{ display: 'block', width: '100%', height: '100%', borderRadius: 'var(--radius-md)', cursor: 'grab', touchAction: 'none' }}
          />
          {/* 3분할 격자: 사진이 들어가는 칸 위에만, PNG에는 안 들어간다 */}
          {box && (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: `${(box.x / W) * 100}%`,
                top: `${(box.y / H) * 100}%`,
                width: `${(box.w / W) * 100}%`,
                height: `${(box.h / H) * 100}%`,
                pointerEvents: 'none',
                border: '1px solid rgba(255,255,255,0.9)',
                backgroundImage:
                  'linear-gradient(to right, transparent calc(33.33% - 0.5px), rgba(255,255,255,0.55) calc(33.33% - 0.5px), rgba(255,255,255,0.55) calc(33.33% + 0.5px), transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), rgba(255,255,255,0.55) calc(66.66% - 0.5px), rgba(255,255,255,0.55) calc(66.66% + 0.5px), transparent calc(66.66% + 0.5px)),' +
                  'linear-gradient(to bottom, transparent calc(33.33% - 0.5px), rgba(255,255,255,0.55) calc(33.33% - 0.5px), rgba(255,255,255,0.55) calc(33.33% + 0.5px), transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), rgba(255,255,255,0.55) calc(66.66% - 0.5px), rgba(255,255,255,0.55) calc(66.66% + 0.5px), transparent calc(66.66% + 0.5px))',
              }}
            />
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>사진을 드래그해 위치를 옮기고, 휠이나 슬라이더로 크기를 바꿔요</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: 'min(360px, 100%)' }}>
          <TbZoomOut aria-hidden size={18} />
          <input
            type="range"
            aria-label="크기"
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            step={0.01}
            value={view.zoom}
            onChange={(e) => patch({ zoom: Number(e.target.value) })}
            style={{ flex: 1, minWidth: 0, accentColor: 'var(--accent)' }}
          />
          <TbZoomIn aria-hidden size={18} />
          <span style={{ width: '3rem', textAlign: 'right', fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums' }}>{Math.round(view.zoom * 100)}%</span>
        </label>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <ToolButton label={`회전 ${view.rotate}°`} onClick={() => patch({ rotate: (view.rotate + 90) % 360 })}>
            <TbRotateClockwise2 size={22} />
          </ToolButton>
          <ToolButton label="좌우 반전" pressed={view.flip} onClick={() => patch({ flip: !view.flip })}>
            <TbFlipVertical size={22} />
          </ToolButton>
          <ToolButton label="초기화" onClick={() => setView(DEFAULT_VIEW)}>
            <TbRestore size={22} />
          </ToolButton>
        </div>
      </div>
    </motion.div>,
    document.body,
  )
}

function ToolButton({ label, pressed, onClick, children }: { label: string; pressed?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.25rem',
        fontSize: '0.72rem',
        color: pressed ? 'var(--accent)' : 'inherit',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {children}
      {label}
    </button>
  )
}

const textButton: React.CSSProperties = {
  padding: '0.4rem 0.6rem',
  fontSize: '0.95rem',
  color: 'inherit',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
}
