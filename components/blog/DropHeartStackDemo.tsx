'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { IconType } from 'react-icons'
import { FiHeart, FiStar, FiZap, FiSun, FiMoon, FiSmile, FiCloud, FiCoffee } from 'react-icons/fi'

// ─── 물리 상수 ───────────────────────────────────────────────────────────────
const G            = 0.5
const RESTITUTION  = 0.40
const FLOOR_MU     = 0.12
const DAMPING      = 0.975
const SLOP         = 0.5
const CORR_PCT     = 0.60   // 겹침 보정 강도 (높을수록 빠르게 분리)
const ITERATIONS   = 10     // 반복 횟수 증가 → 겹침 제거
const SLEEP_V      = 0.35
const SLEEP_FRAMES = 10
const WAKE_IMPULSE = 1.0

// ─── 씬 상수 ─────────────────────────────────────────────────────────────────
const H             = 480
const FLOOR_SURFACE = H - 8  // 바닥 표면 Y (아이템 중심 = FLOOR_SURFACE - r)

// ─── 데모 상수 ────────────────────────────────────────────────────────────────
const MAX_ITEMS   = 60
const BURST_COUNT = 20
const RADII  = [14, 18, 22, 26, 30]
const ICONS: IconType[] = [FiHeart, FiStar, FiZap, FiSun, FiMoon, FiSmile, FiCloud, FiCoffee]
const ICON_PALETTE = [
  { bg: 'rgba(59,130,246,0.13)',  iconColor: '#3b82f6' },
  { bg: 'rgba(99,102,241,0.13)',  iconColor: '#6366f1' },
  { bg: 'rgba(168,85,247,0.13)',  iconColor: '#a855f7' },
  { bg: 'rgba(236,72,153,0.13)',  iconColor: '#ec4899' },
  { bg: 'rgba(16,185,129,0.13)',  iconColor: '#10b981' },
  { bg: 'rgba(245,158,11,0.13)',  iconColor: '#f59e0b' },
  { bg: 'rgba(239,68,68,0.13)',   iconColor: '#ef4444' },
  { bg: 'rgba(6,182,212,0.13)',   iconColor: '#06b6d4' },
]

let nextId = 0

interface Item {
  id: number
  r: number           // 개별 반지름
  x: number; y: number
  vx: number; vy: number
  angle: number
  Icon: IconType; bgColor: string; iconColor: string
  sleeping: boolean; sleepFrames: number
}

// ─── 충돌 해석기 ─────────────────────────────────────────────────────────────
function solveCollisions(items: Item[], W: number) {
  for (let iter = 0; iter < ITERATIONS; iter++) {

    // ── 경계 충돌 ─────────────────────────────────────────────────────────
    for (const a of items) {
      if (a.sleeping) continue
      const floor = FLOOR_SURFACE - a.r
      if (a.y > floor) {
        a.y = floor
        if (a.vy > 0) { a.vy = -a.vy * RESTITUTION; a.vx *= (1 - FLOOR_MU) }
      }
      if (a.y - a.r < 0 && a.vy < 0) { a.y = a.r; a.vy = 0 }
      if (a.x - a.r < 0)  { a.x = a.r;     a.vx =  Math.abs(a.vx) * RESTITUTION }
      if (a.x + a.r > W)  { a.x = W - a.r; a.vx = -Math.abs(a.vx) * RESTITUTION }
    }

    // ── 원-원 충돌 ────────────────────────────────────────────────────────
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i]
        const b = items[j]
        if (a.sleeping && b.sleeping) continue

        const minDist = a.r + b.r
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d2 = dx * dx + dy * dy
        if (d2 >= minDist * minDist || d2 < 1e-4) continue

        const dist        = Math.sqrt(d2)
        const nx          = dx / dist
        const ny          = dy / dist
        const penetration = minDist - dist

        const relVx = b.vx - a.vx
        const relVy = b.vy - a.vy
        const velN  = relVx * nx + relVy * ny

        if (velN < 0) {
          const tempInv = (a.sleeping ? 0.5 : 1) + (b.sleeping ? 0.5 : 1)
          const jEst    = Math.abs(-(1 + RESTITUTION) * velN / tempInv)
          if (a.sleeping && jEst > WAKE_IMPULSE) { a.sleeping = false; a.sleepFrames = 0 }
          if (b.sleeping && jEst > WAKE_IMPULSE) { b.sleeping = false; b.sleepFrames = 0 }

          const ima = a.sleeping ? 0 : 1
          const imb = b.sleeping ? 0 : 1
          const tim = ima + imb
          if (tim > 0) {
            const jj = -(1 + RESTITUTION) * velN / tim
            a.vx -= jj * nx * ima; a.vy -= jj * ny * ima
            b.vx += jj * nx * imb; b.vy += jj * ny * imb
          }
        }

        // 위치 보정
        const imaC = a.sleeping ? 0 : 1
        const imbC = b.sleeping ? 0 : 1
        const timC = imaC + imbC
        if (timC === 0) continue

        const corrMag = Math.max(penetration - SLOP, 0) * CORR_PCT / timC
        if (corrMag > 0) {
          a.x -= corrMag * nx * imaC; a.y -= corrMag * ny * imaC
          b.x += corrMag * nx * imbC; b.y += corrMag * ny * imbC
        }
      }
    }
  }
}

type Mode = 'single' | 'burst'

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function DropHeartStackDemo() {
  const itemsRef = useRef<Item[]>([])
  const animRef  = useRef<number>(0)
  const wRef     = useRef(600)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [, setRenderKey] = useState(0)
  const [mode, setMode]  = useState<Mode>('single')

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return
    wRef.current = el.offsetWidth
    const ro = new ResizeObserver(entries => {
      wRef.current = entries[0].contentRect.width
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const tick = useCallback(() => {
    const items = itemsRef.current
    const W     = wRef.current
    let anyAwake = false

    for (const a of items) {
      if (a.sleeping) continue
      anyAwake = true
      a.vy += G; a.vx *= DAMPING; a.vy *= DAMPING
      a.x += a.vx; a.y += a.vy
      // 굴림: 수평 이동량 / 반지름 → 각도(deg)
      a.angle += (a.vx / a.r) * (180 / Math.PI)
    }

    const sleepingBefore = items.filter(i => i.sleeping).length
    if (items.length > 0) solveCollisions(items, W)
    const justWoke = items.filter(i => !i.sleeping).length > (items.length - sleepingBefore)

    let justSlept = false
    for (const a of items) {
      if (a.sleeping) continue
      const speed = Math.abs(a.vx) + Math.abs(a.vy)
      if (speed < SLEEP_V) {
        a.sleepFrames++
        if (a.sleepFrames >= SLEEP_FRAMES) {
          a.sleeping = true; a.vx = 0; a.vy = 0; justSlept = true
        }
      } else {
        a.sleepFrames = 0
      }
    }

    if (anyAwake || justSlept || justWoke) setRenderKey(k => k + 1)
    animRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [tick])

  const spawn = useCallback((count: number) => {
    const W = wRef.current
    const remaining = MAX_ITEMS - itemsRef.current.length
    if (remaining <= 0) return
    const actual = Math.min(count, remaining)
    for (let k = 0; k < actual; k++) {
      const r   = RADII[Math.floor(Math.random() * RADII.length)]
      const p   = ICON_PALETTE[Math.floor(Math.random() * ICON_PALETTE.length)]
      const maxR = RADII[RADII.length - 1]
      itemsRef.current.push({
        id: nextId++,
        r,
        x: count > 1
          ? r + 4 + Math.random() * (W / 3 - r * 2)
          : r + 4 + Math.random() * (W - r * 2 - 8),
        y: -r - (count > 1 ? k * (maxR * 2 + 4) : 0),
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 2 + 1,
        angle: Math.random() * 360,
        Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        bgColor: p.bg,
        iconColor: p.iconColor,
        sleeping: false,
        sleepFrames: 0,
      })
    }
    setRenderKey(k => k + 1)
  }, [])

  const clear = useCallback(() => {
    itemsRef.current = []
    setRenderKey(k => k + 1)
  }, [])

  const items      = itemsRef.current
  const totalCount = items.length
  const sleepCount = items.filter(i => i.sleeping).length
  const isFull     = totalCount >= MAX_ITEMS
  const spawnCount = mode === 'single' ? 1 : BURST_COUNT

  return (
    <div style={{ width: '100%', fontFamily: 'Pretendard, sans-serif' }}>

      {/* ── 컨트롤 ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'stretch' }}>

        {/* 모드 토글 */}
        <div style={{
          display: 'flex',
          background: 'var(--surface-container)',
          borderRadius: 'var(--radius-xl)', padding: 3, gap: 3, flexShrink: 0,
        }}>
          {(['single', 'burst'] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: '0 12px', border: 'none',
              borderRadius: 'var(--radius-lg)',
              background: mode === m ? 'var(--accent)' : 'transparent',
              color: mode === m ? '#fff' : 'var(--text-muted)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s', whiteSpace: 'nowrap',
            }}>
              {m === 'single' ? '하나씩' : `${BURST_COUNT}개 한번에`}
            </button>
          ))}
        </div>

        {/* 드롭 버튼 */}
        <button onClick={() => spawn(spawnCount)} disabled={isFull} style={{
          flex: 1, padding: '10px 16px', border: 'none',
          borderRadius: 'var(--radius-lg)',
          background: isFull ? 'var(--surface-container)' : 'var(--accent)',
          color: isFull ? 'var(--text-muted)' : '#fff',
          fontSize: 13, fontWeight: 600,
          cursor: isFull ? 'default' : 'pointer',
          transition: 'background 0.15s',
        }}>
          {isFull ? '가득 찼어요' : '하트 떨어뜨리기'}
        </button>

        {/* 초기화 */}
        <button onClick={clear} style={{
          padding: '10px 14px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text-muted)',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
        }}>
          초기화
        </button>
      </div>

      {/* ── 씬 ──────────────────────────────────────────────────────────── */}
      <div ref={sceneRef} style={{
        position: 'relative', width: '100%', height: H,
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>

        {/* 빈 상태 */}
        {totalCount === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 10, pointerEvents: 'none',
          }}>
            <FiHeart size={40} color="var(--text-muted)" style={{ opacity: 0.3 }} />
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              버튼을 눌러 하트를 떨어뜨려보세요
            </div>
          </div>
        )}

        {/* 아이템 */}
        {items.map(item => (
          <div key={item.id} style={{
            position: 'absolute',
            left: item.x - item.r,
            top:  item.y - item.r,
            width:  item.r * 2,
            height: item.r * 2,
            borderRadius: '50%',
            background: item.bgColor,
            border: '1.5px solid var(--border-subtle)',
            boxShadow: item.sleeping
              ? 'var(--shadow-card)'
              : '0 4px 14px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `rotate(${item.angle}deg)`,
            pointerEvents: 'none', userSelect: 'none',
          }}>
            <item.Icon size={Math.round(item.r * 0.9)} color={item.iconColor} />
          </div>
        ))}

        {/* 카운터 */}
        {totalCount > 0 && (
          <div style={{
            position: 'absolute', top: 10, right: 12,
            fontSize: 11, fontWeight: 600,
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}>
            {sleepCount} / {MAX_ITEMS}
            {totalCount - sleepCount > 0 && (
              <span style={{ marginLeft: 5, color: 'var(--accent)' }}>
                ↓{totalCount - sleepCount}
              </span>
            )}
          </div>
        )}

        {/* 하단 진행바 */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: 'var(--border)',
        }}>
          <div style={{
            height: '100%',
            width: `${(sleepCount / MAX_ITEMS) * 100}%`,
            background: 'var(--accent)',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
    </div>
  )
}
