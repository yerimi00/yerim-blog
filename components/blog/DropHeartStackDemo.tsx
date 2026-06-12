'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── 물리 상수 ───────────────────────────────────────────────────────────────
const R          = 22      // 원 반지름 (px)
const D          = R * 2   // 지름
const G          = 0.5     // 중력 가속도 (px/frame²)
const RESTITUTION = 0.28   // 반발계수 (0=완전 비탄성, 1=완전 탄성)
const FLOOR_MU   = 0.30    // 바닥 마찰 (vx 감쇠 비율)
const DAMPING    = 0.985   // 공기 저항 (매 프레임 속도에 곱함)
const SLOP       = 0.6     // 허용 침투 깊이 — 이하면 위치 보정 생략 (jitter 방지)
const CORR_PCT   = 0.40    // 침투 보정 강도 (0~1, 값이 클수록 급격히 밀림)
const ITERATIONS = 6       // 충돌 해석 반복 횟수 (높을수록 안정, 무거움)
const SLEEP_V    = 0.30    // 이 속도 이하로 SLEEP_FRAMES 프레임 유지 시 sleep
const SLEEP_FRAMES = 10

// ─── 씬 상수 ─────────────────────────────────────────────────────────────────
const W     = 320
const H     = 460
const FLOOR = H - R - 10   // 바닥 Y (원 중심 기준)

// ─── 데모 상수 ────────────────────────────────────────────────────────────────
const MAX_ITEMS = 50
const EMOJIS = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷']
const COLORS  = ['#fce7f3', '#fff7ed', '#fef9c3', '#dcfce7', '#dbeafe', '#ede9fe', '#fdf2f8']

let nextId = 0

interface Item {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  emoji: string
  color: string
  sleeping: boolean    // true → 무한 질량 정적 바디로 취급
  sleepFrames: number  // 저속 프레임 카운터
}

// ─── 충돌 해석기 ─────────────────────────────────────────────────────────────
//
// sleeping 아이템 = 정적 바디 (inv_mass = 0) → 속도·위치 불변
// dynamic 아이템 = inv_mass = 1 (모든 원 질량 동일하게 단순화)
//
function solveCollisions(items: Item[]) {
  for (let iter = 0; iter < ITERATIONS; iter++) {

    // ── 경계 충돌 ─────────────────────────────────────────────────────────
    for (const a of items) {
      if (a.sleeping) continue

      // 바닥
      if (a.y + R > FLOOR) {
        a.y = FLOOR - R
        if (a.vy > 0) {
          a.vy = -a.vy * RESTITUTION
          a.vx *= (1 - FLOOR_MU)
        }
      }
      // 천장 (스폰 직후 가드)
      if (a.y - R < 0 && a.vy < 0) { a.y = R; a.vy = 0 }
      // 좌벽
      if (a.x - R < 0)  { a.x = R;     a.vx =  Math.abs(a.vx) * RESTITUTION }
      // 우벽
      if (a.x + R > W)  { a.x = W - R; a.vx = -Math.abs(a.vx) * RESTITUTION }
    }

    // ── 원-원 충돌 ────────────────────────────────────────────────────────
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i]
        const b = items[j]
        if (a.sleeping && b.sleeping) continue

        const dx  = b.x - a.x
        const dy  = b.y - a.y
        const d2  = dx * dx + dy * dy
        if (d2 >= D * D || d2 < 1e-4) continue

        const dist        = Math.sqrt(d2)
        const nx          = dx / dist          // 충돌 법선 (a→b 방향)
        const ny          = dy / dist
        const penetration = D - dist

        // 역질량: sleeping = 정적 바디이므로 0
        const ima = a.sleeping ? 0 : 1
        const imb = b.sleeping ? 0 : 1
        const totalInvMass = ima + imb
        if (totalInvMass === 0) continue

        // 상대속도의 법선 성분
        const relVx = b.vx - a.vx
        const relVy = b.vy - a.vy
        const velN  = relVx * nx + relVy * ny

        // 서로 가까워지는 경우에만 impulse 적용
        if (velN < 0) {
          const j = -(1 + RESTITUTION) * velN / totalInvMass
          a.vx -= j * nx * ima
          a.vy -= j * ny * ima
          b.vx += j * nx * imb
          b.vy += j * ny * imb
        }

        // 위치 보정 (슬롭 이하 침투는 무시 → jitter 방지)
        const corrMag = Math.max(penetration - SLOP, 0) * CORR_PCT / totalInvMass
        if (corrMag > 0) {
          a.x -= corrMag * nx * ima
          a.y -= corrMag * ny * ima
          b.x += corrMag * nx * imb
          b.y += corrMag * ny * imb
        }
      }
    }
  }
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function DropHeartStackDemo() {
  const itemsRef = useRef<Item[]>([])
  const animRef  = useRef<number>(0)
  const [, setRenderKey] = useState(0)

  const tick = useCallback(() => {
    const items = itemsRef.current
    let anyAwake = false

    // 1. 중력 + 공기저항 + 이동
    for (const a of items) {
      if (a.sleeping) continue
      anyAwake = true
      a.vy += G
      a.vx *= DAMPING
      a.vy *= DAMPING
      a.x  += a.vx
      a.y  += a.vy
    }

    // 2. 충돌 해석 (반복)
    if (items.length > 0) solveCollisions(items)

    // 3. Sleep 판정
    let justSlept = false
    for (const a of items) {
      if (a.sleeping) continue
      const speed = Math.abs(a.vx) + Math.abs(a.vy)
      if (speed < SLEEP_V) {
        a.sleepFrames++
        if (a.sleepFrames >= SLEEP_FRAMES) {
          a.sleeping = true
          a.vx = 0
          a.vy = 0
          justSlept = true
        }
      } else {
        a.sleepFrames = 0
      }
    }

    // 4. 활성 아이템이 있거나 방금 잠든 아이템이 있으면 리렌더
    if (anyAwake || justSlept) setRenderKey(k => k + 1)

    animRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [tick])

  const spawn = useCallback(() => {
    if (itemsRef.current.length >= MAX_ITEMS) return
    const idx = Math.floor(Math.random() * EMOJIS.length)
    itemsRef.current.push({
      id: nextId++,
      x:  R + 8 + Math.random() * (W - 2 * R - 16),
      y:  -R,
      vx: (Math.random() - 0.5) * 3,
      vy: 1,
      emoji: EMOJIS[idx],
      color: COLORS[idx],
      sleeping: false,
      sleepFrames: 0,
    })
    setRenderKey(k => k + 1)
  }, [])

  const clear = useCallback(() => {
    itemsRef.current = []
    setRenderKey(k => k + 1)
  }, [])

  const items        = itemsRef.current
  const totalCount   = items.length
  const sleepCount   = items.filter(i => i.sleeping).length
  const isFull       = totalCount >= MAX_ITEMS

  return (
    <div style={{ width: W, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      {/* 버튼 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button
          onClick={spawn}
          disabled={isFull}
          style={{
            flex: 1, padding: '12px', border: 'none', borderRadius: 10,
            background: isFull ? '#e5e7eb' : '#a855f7',
            color: isFull ? '#9ca3af' : '#fff',
            fontSize: 14, fontWeight: 600,
            cursor: isFull ? 'default' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {isFull ? '가득 찼어요 🎉' : '하트 떨어뜨리기 💜'}
        </button>
        <button
          onClick={clear}
          style={{
            padding: '12px 16px', borderRadius: 10,
            border: '1px solid var(--border, #e5e7eb)',
            background: 'var(--surface, #fff)',
            color: 'var(--text-muted, #6b7280)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          초기화
        </button>
      </div>

      {/* 카운터 */}
      <div style={{ marginBottom: 8 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 11, color: 'var(--text-muted, #9ca3af)', marginBottom: 4,
        }}>
          <span>{sleepCount} / {MAX_ITEMS} 정착</span>
          <span>{totalCount - sleepCount > 0 ? `↓ ${totalCount - sleepCount}개 낙하 중` : ''}</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--border, #e5e7eb)' }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${(sleepCount / MAX_ITEMS) * 100}%`,
            background: '#a855f7',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* 씬 */}
      <div style={{
        position: 'relative', width: W, height: H,
        background: 'linear-gradient(170deg, #f8f4ff 0%, #fff0f8 100%)',
        borderRadius: 20, overflow: 'hidden',
        border: '1px solid var(--border, #e5e7eb)',
      }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: item.x - R,
              top:  item.y - R,
              width:  D,
              height: D,
              borderRadius: '50%',
              background: item.color,
              border: '2px solid rgba(168,85,247,0.18)',
              boxShadow: item.sleeping
                ? '0 2px 6px rgba(0,0,0,0.08)'
                : '0 6px 18px rgba(0,0,0,0.16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {item.emoji}
          </div>
        ))}

        {items.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 10, color: 'var(--text-muted, #9ca3af)',
          }}>
            <div style={{ fontSize: 36 }}>💜</div>
            <div style={{ fontSize: 13 }}>버튼을 눌러 하트를 떨어뜨려보세요</div>
          </div>
        )}
      </div>
    </div>
  )
}
