import type { CSSProperties } from 'react'

const CARD_H   = 514
const HANDLE_H = 20
const DARK = '#16181f'

const cardWrapperBase: CSSProperties = {
  position: 'absolute',
  top: 0, left: 0, right: 0,
  height: CARD_H,
  willChange: 'transform',
  display: 'flex',
  flexDirection: 'column',
}

const handleStyle: CSSProperties = {
  height: HANDLE_H,
  background: DARK,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const handlePillStyle: CSSProperties = {
  width: 36, height: 4,
  borderRadius: 9999,
  background: '#3d4055',
}

const bodyStyle: CSSProperties = {
  flex: 1,
  background: DARK,
  borderRadius: '20px 20px 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const labelStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: '#f9fafb',
}

interface Props {
  pi:      number
  isActive: boolean
  elRef:   (el: HTMLDivElement | null) => void
}

export default function CardStackCard({ pi, isActive, elRef }: Props) {
  return (
    <div
      ref={elRef}
      style={{ ...cardWrapperBase, pointerEvents: isActive ? 'auto' : 'none' }}
    >
      <div style={handleStyle}>
        <div style={handlePillStyle} />
      </div>
      <div style={bodyStyle}>
        <span style={labelStyle}>카드 {pi + 1}</span>
      </div>
    </div>
  )
}
