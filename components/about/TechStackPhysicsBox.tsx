'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { IconType } from 'react-icons'
import {
  SiHtml5, SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiRecoil, SiReactquery, SiStyledcomponents, SiTailwindcss,
  SiFlutter, SiFigma, SiSlack, SiDiscord, SiIntellijidea,
  SiGit, SiGithub, SiApple, SiSpringboot, SiOpenjdk,
  SiHibernate, SiMysql, SiNotion,
} from 'react-icons/si'
import { DiCss3, DiWindows, DiVisualstudio, DiJava } from 'react-icons/di'
import type { TechItem } from './TechStackGrid'

// ─── 물리 상수 ────────────────────────────────────────────────────────────────
const G            = 0.5
const RESTITUTION  = 0.12   // 덜 튀게
const FLOOR_MU     = 0.18
const DAMPING      = 0.94   // 공기저항 크게
const SLOP         = 0.5
const CORR_PCT     = 0.65
const ITERATIONS   = 10
const SLEEP_V      = 0.3
const SLEEP_FRAMES = 10
const WAKE_IMPULSE = 1.0

const BOX_H         = 180
const FLOOR_SURFACE = BOX_H - 6

// ─── 레벨 → 반지름 ────────────────────────────────────────────────────────────
const LEVEL_R: Record<string, number> = {
  '상':   26,
  '중상': 22,
  '중':   18,
  '초중': 14,
  '입문': 11,
}
const DEFAULT_R = 18

// ─── 아이콘 맵 ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, IconType> = {
  SiHtml5, SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiRecoil, SiReactquery, SiStyledcomponents, SiTailwindcss,
  SiFlutter, SiFigma, SiSlack, SiDiscord, SiIntellijidea,
  SiGit, SiGithub, SiApple, SiSpringboot, SiOpenjdk,
  SiHibernate, SiMysql, SiNotion,
  DiCss3, DiWindows, DiVisualstudio, DiJava,
}

const ICON_COLOR: Record<string, string> = {
  SiHtml5:            '#E34F26',
  DiCss3:             '#1572B6',
  SiJavascript:       '#c9a800',
  SiTypescript:       '#3178C6',
  SiReact:            '#3ab8d8',
  SiNextdotjs:        '#666',
  SiRecoil:           '#3578E5',
  SiReactquery:       '#FF4154',
  SiStyledcomponents: '#DB7093',
  SiTailwindcss:      '#06B6D4',
  SiFlutter:          '#02569B',
  SiFigma:            '#F24E1E',
  SiSlack:            '#4A154B',
  SiDiscord:          '#5865F2',
  DiVisualstudio:     '#007ACC',
  SiIntellijidea:     '#FE315D',
  SiGit:              '#F05032',
  SiGithub:           '#888',
  SiApple:            '#888',
  DiWindows:          '#0078D4',
  SiSpringboot:       '#6DB33F',
  DiJava:             '#ED8B00',
  SiOpenjdk:          '#ED8B00',
  SiHibernate:        '#59666C',
  SiMysql:            '#4479A1',
  SiNotion:           '#888',
}

function hexToRgba(hex: string, alpha: number): string {
  if (!hex.startsWith('#')) return `rgba(120,120,120,${alpha})`
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// ─── 타입 ─────────────────────────────────────────────────────────────────────
interface PhysicsItem {
  id: number
  r: number
  x: number; y: number
  vx: number; vy: number
  angle: number
  sleeping: boolean; sleepFrames: number
  name: string
  iconKey: string
  iconColor: string
  bgColor: string
}

let nextId = 0

// ─── 충돌 해석 ────────────────────────────────────────────────────────────────
function solveCollisions(items: PhysicsItem[], W: number) {
  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (const a of items) {
      if (a.sleeping) continue
      const floor = FLOOR_SURFACE - a.r
      if (a.y > floor) { a.y = floor; if (a.vy > 0) { a.vy = -a.vy * RESTITUTION; a.vx *= (1 - FLOOR_MU) } }
      if (a.y - a.r < 0 && a.vy < 0) { a.y = a.r; a.vy = 0 }
      if (a.x - a.r < 0)  { a.x = a.r;     a.vx =  Math.abs(a.vx) * RESTITUTION }
      if (a.x + a.r > W)  { a.x = W - a.r; a.vx = -Math.abs(a.vx) * RESTITUTION }
    }
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i]; const b = items[j]
        if (a.sleeping && b.sleeping) continue
        const dx = b.x - a.x; const dy = b.y - a.y
        const d2 = dx * dx + dy * dy
        const minDist = a.r + b.r
        if (d2 >= minDist * minDist || d2 < 1e-4) continue
        const dist = Math.sqrt(d2)
        const nx = dx / dist; const ny = dy / dist
        const penetration = minDist - dist
        const velN = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
        if (velN < 0) {
          const jEst = Math.abs(-(1 + RESTITUTION) * velN / 2)
          if (a.sleeping && jEst > WAKE_IMPULSE) { a.sleeping = false; a.sleepFrames = 0 }
          if (b.sleeping && jEst > WAKE_IMPULSE) { b.sleeping = false; b.sleepFrames = 0 }
          const ima = a.sleeping ? 0 : 1; const imb = b.sleeping ? 0 : 1; const tim = ima + imb
          if (tim > 0) {
            const jj = -(1 + RESTITUTION) * velN / tim
            a.vx -= jj * nx * ima; a.vy -= jj * ny * ima
            b.vx += jj * nx * imb; b.vy += jj * ny * imb
          }
        }
        const imaC = a.sleeping ? 0 : 1; const imbC = b.sleeping ? 0 : 1; const timC = imaC + imbC
        if (timC === 0) continue
        const corr = Math.max(penetration - SLOP, 0) * CORR_PCT / timC
        if (corr > 0) {
          a.x -= corr * nx * imaC; a.y -= corr * ny * imaC
          b.x += corr * nx * imbC; b.y += corr * ny * imbC
        }
      }
    }
  }
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────
export default function TechStackPhysicsBox({ techStack }: { techStack: TechItem[] }) {
  const itemsRef = useRef<PhysicsItem[]>([])
  const animRef  = useRef<number>(0)
  const wRef     = useRef(600)
  const sceneRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const [, setRenderKey] = useState(0)

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return
    wRef.current = el.offsetWidth
    const ro = new ResizeObserver(e => { wRef.current = e[0].contentRect.width })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // raf 루프
  const tick = useCallback(() => {
    const items = itemsRef.current
    const W     = wRef.current
    let anyAwake = false
    for (const a of items) {
      if (a.sleeping) continue
      anyAwake = true
      a.vy += G; a.vx *= DAMPING; a.vy *= DAMPING
      a.x += a.vx; a.y += a.vy
      a.angle += (a.vx / a.r) * (180 / Math.PI)
    }
    const sleepBefore = items.filter(i => i.sleeping).length
    if (items.length > 0) solveCollisions(items, W)
    const justWoke = items.filter(i => !i.sleeping).length > (items.length - sleepBefore)
    let justSlept = false
    for (const a of items) {
      if (a.sleeping) continue
      if (Math.abs(a.vx) + Math.abs(a.vy) < SLEEP_V) {
        a.sleepFrames++
        if (a.sleepFrames >= SLEEP_FRAMES) { a.sleeping = true; a.vx = 0; a.vy = 0; justSlept = true }
      } else { a.sleepFrames = 0 }
    }
    if (anyAwake || justSlept || justWoke) setRenderKey(k => k + 1)
    animRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [tick])

  // 아이템 순차 spawn
  const spawnAll = useCallback(() => {
    // 스폰 직전에 실제 DOM 너비를 읽어 wRef를 갱신
    if (sceneRef.current) wRef.current = sceneRef.current.offsetWidth

    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    itemsRef.current = []
    setRenderKey(k => k + 1)

    techStack.forEach((tech, idx) => {
      const t = setTimeout(() => {
        const W = wRef.current
        const r = LEVEL_R[tech.level] ?? DEFAULT_R
        const iconColor = ICON_COLOR[tech.icon] ?? '#888'
        itemsRef.current.push({
          id: nextId++,
          r,
          x: r + 4 + Math.random() * Math.max(W - r * 2 - 8, 1),
          y: -r - 4,
          vx: (Math.random() - 0.5) * 7,
          vy: Math.random() * 2 + 1,
          angle: Math.random() * 360,
          sleeping: false, sleepFrames: 0,
          name: tech.name,
          iconKey: tech.icon,
          iconColor,
          bgColor: hexToRgba(iconColor, 0.14),
        })
        setRenderKey(k => k + 1)
      }, idx * 55)
      timersRef.current.push(t)
    })
  }, [techStack])

  // 마운트 + techStack 변경 시 자동 실행
  useEffect(() => {
    const t = setTimeout(spawnAll, 250)
    return () => {
      clearTimeout(t)
      timersRef.current.forEach(clearTimeout)
    }
  }, [spawnAll])

  const items = itemsRef.current

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        ref={sceneRef}
        style={{
          position: 'relative',
          width: '100%',
          height: BOX_H,
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {/* 리셋 버튼 */}
        <button
          onClick={spawnAll}
          title="다시 떨어뜨리기"
          style={{
            position: 'absolute', top: 10, right: 12, zIndex: 2,
            width: 32, height: 32,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface)',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          🎲
        </button>

        {/* 물리 아이템 */}
        {items.map(item => {
          const IconComp = ICON_MAP[item.iconKey]
          const iconSize = Math.round(item.r * 0.88)
          return (
            <div
              key={item.id}
              title={item.name}
              style={{
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
                  : '0 3px 10px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `rotate(${item.angle}deg)`,
                pointerEvents: 'none', userSelect: 'none',
              }}
            >
              {item.iconKey.startsWith('img:') ? (
                <img
                  src={`/icons/${item.iconKey.slice(4)}.svg`}
                  alt={item.name}
                  width={iconSize}
                  height={iconSize}
                  style={{ objectFit: 'contain' }}
                />
              ) : IconComp ? (
                <IconComp size={iconSize} color={item.iconColor} />
              ) : (
                <span style={{
                  fontSize: Math.max(iconSize * 0.38, 7),
                  fontWeight: 700,
                  color: item.iconColor,
                  lineHeight: 1,
                }}>
                  {item.name.slice(0, 2)}
                </span>
              )}
            </div>
          )
        })}

        {/* 바닥 선 */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: 'var(--border)', opacity: 0.5,
        }} />
      </div>
    </div>
  )
}
