'use client'

import { useRef } from 'react'

const MAX_TILT = 8

// 마우스 방향으로 기울고 빛이 따라오는 카드. 터치·reduced-motion에서는 CSS가 효과를 끈다
export default function TiltCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--tilt-x', `${(0.5 - y) * MAX_TILT * 2}deg`)
    el.style.setProperty('--tilt-y', `${(x - 0.5) * MAX_TILT * 2}deg`)
    el.style.setProperty('--glare-x', `${x * 100}%`)
    el.style.setProperty('--glare-y', `${y * 100}%`)
    el.classList.add('is-tilting')
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    el.classList.remove('is-tilting')
  }

  return (
    <div ref={ref} className="tilt-card" style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  )
}
