'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import type { IconType } from 'react-icons'
import {
  SiHtml5, SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiRecoil, SiReactquery, SiStyledcomponents, SiTailwindcss,
  SiFlutter, SiDiscord, SiIntellijidea, SiGit, SiGithub,
  SiApple, SiSpringboot, SiHibernate, SiMysql, SiNotion,
} from 'react-icons/si'
import { DiCss3, DiWindows, DiVisualstudio, DiJava } from 'react-icons/di'
import type { NotionProject } from '@/lib/projects'

// ─── 물리 상수 ───────────────────────────────────────────────────────────────
const G            = 1.4
const RESTITUTION  = 0.1
const FLOOR_MU     = 0.18
const DAMPING      = 0.97
const SLOP         = 0.5
const CORR_PCT     = 0.65
const ITERATIONS   = 10
const SLEEP_V      = 0.3
const SLEEP_FRAMES = 10
const WAKE_IMPULSE = 1.0

const LEVEL_R: Record<string, number> = {
  '상': 68, '중상': 56, '중': 44, '초중': 32, '입문': 22,
}

const ICON_MAP: Record<string, IconType> = {
  SiHtml5, SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiRecoil, SiReactquery, SiStyledcomponents, SiTailwindcss,
  SiFlutter, SiDiscord, SiIntellijidea, SiGit, SiGithub,
  SiApple, SiSpringboot, SiHibernate, SiMysql, SiNotion,
  DiCss3, DiWindows, DiVisualstudio, DiJava,
}

const ICON_COLOR: Record<string, string> = {
  SiHtml5: '#E34F26', DiCss3: '#1572B6', SiJavascript: '#c9a800',
  SiTypescript: '#3178C6', SiReact: '#3ab8d8', SiNextdotjs: '#666',
  SiRecoil: '#3578E5', SiReactquery: '#FF4154', SiStyledcomponents: '#DB7093',
  SiTailwindcss: '#06B6D4', SiFlutter: '#02569B', SiDiscord: '#5865F2',
  DiVisualstudio: '#007ACC', SiIntellijidea: '#FE315D', SiGit: '#F05032',
  SiGithub: '#888', SiApple: '#888', DiWindows: '#0078D4',
  SiSpringboot: '#6DB33F', DiJava: '#ED8B00', SiHibernate: '#59666C',
  SiMysql: '#4479A1', SiNotion: '#888',
}

const LANDING_ITEMS = [
  { name: 'HTML5',        level: '상',  icon: 'SiHtml5' },
  { name: 'CSS3',         level: '상',  icon: 'DiCss3' },
  { name: 'JavaScript',   level: '상',  icon: 'SiJavascript' },
  { name: 'TypeScript',   level: '중상', icon: 'SiTypescript' },
  { name: 'React',        level: '중상', icon: 'SiReact' },
  { name: 'Next.js',      level: '중',  icon: 'SiNextdotjs' },
  { name: 'Recoil',       level: '중',  icon: 'SiRecoil' },
  { name: 'TanStack Q.',  level: '중',  icon: 'SiReactquery' },
  { name: 'Styled Comp.', level: '중',  icon: 'SiStyledcomponents' },
  { name: 'TailwindCSS',  level: '중상', icon: 'SiTailwindcss' },
  { name: 'Flutter',      level: '입문', icon: 'SiFlutter' },
  { name: 'Figma',        level: '중상', icon: 'img:figma' },
  { name: 'Slack',        level: '상',  icon: 'img:slack' },
  { name: 'Discord',      level: '상',  icon: 'SiDiscord' },
  { name: 'VS Code',      level: '상',  icon: 'DiVisualstudio' },
  { name: 'IntelliJ',     level: '중',  icon: 'SiIntellijidea' },
  { name: 'Git',          level: '상',  icon: 'SiGit' },
  { name: 'GitHub',       level: '상',  icon: 'SiGithub' },
  { name: 'macOS',        level: '상',  icon: 'SiApple' },
  { name: 'Windows',      level: '상',  icon: 'DiWindows' },
  { name: 'Spring Boot',  level: '중',  icon: 'SiSpringboot' },
  { name: 'Java',         level: '중',  icon: 'DiJava' },
  { name: 'JPA',          level: '초중', icon: 'SiHibernate' },
  { name: 'MySQL',        level: '초중', icon: 'SiMysql' },
  { name: 'Notion',       level: '상',  icon: 'SiNotion' },
]

function hexToRgba(hex: string, alpha: number): string {
  if (!hex.startsWith('#')) return `rgba(120,120,120,${alpha})`
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

interface PhysicsItem {
  id: number; r: number
  x: number; y: number; vx: number; vy: number; angle: number
  sleeping: boolean; sleepFrames: number
  name: string; iconKey: string; iconColor: string; bgColor: string
}

let heroId = 0

function solveCollisions(items: PhysicsItem[], W: number, H: number) {
  for (let iter = 0; iter < ITERATIONS; iter++) {
    for (const a of items) {
      if (a.sleeping) continue
      const floor = H - a.r - 4
      if (a.y > floor) {
        a.y = floor
        if (a.vy > 0) { a.vy = -a.vy * RESTITUTION; a.vx *= (1 - FLOOR_MU) }
      }
      if (a.y - a.r < 0 && a.vy < 0) { a.y = a.r; a.vy = 0 }
      if (a.x - a.r < 0) { a.x = a.r;     a.vx =  Math.abs(a.vx) * RESTITUTION }
      if (a.x + a.r > W) { a.x = W - a.r; a.vx = -Math.abs(a.vx) * RESTITUTION }
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

// ─── 루핑 타이핑 훅 (세그먼트 기반) ─────────────────────────────────────────
type Segment = { text: string; highlight: boolean }

const PHRASE_SEGMENTS: Segment[][] = [
  [
    { text: '결과로',          highlight: false },
    { text: ' ',              highlight: false },
    { text: '신뢰를',          highlight: true  },
    { text: ' 만드는\n',       highlight: false },
    { text: '개발자',          highlight: true  },
    { text: ' ',              highlight: false },
    { text: '이예림입니다.',    highlight: true  },
  ],
  [
    { text: '개발과',                          highlight: true  },
    { text: ' ',                              highlight: false },
    { text: '기획',                            highlight: true  },
    { text: ' 사이에서 다리를 놓는\n',           highlight: false },
    { text: 'PM',                             highlight: true  },
    { text: ' ',                              highlight: false },
    { text: '이예림입니다.',                    highlight: true  },
  ],
]

function renderSegments(segments: Segment[], revealedCount: number) {
  let remaining = revealedCount
  return segments.map((seg, i) => {
    if (remaining <= 0) return null
    const visible = seg.text.slice(0, remaining)
    remaining -= seg.text.length
    if (!visible) return null
    return (
      <span
        key={i}
        style={{
          color: seg.highlight ? 'var(--accent)' : 'var(--text-muted)',
          fontWeight: 700,
        }}
      >
        {visible}
      </span>
    )
  })
}

function useLoopingTypewriter() {
  const [phraseIdx,     setPhraseIdx]     = useState(0)
  const [revealedCount, setRevealedCount] = useState(0)
  const [phase,         setPhase]         = useState<'typing' | 'erasing'>('typing')

  const segments    = PHRASE_SEGMENTS[phraseIdx]
  const totalLength = segments.reduce((s, seg) => s + seg.text.length, 0)

  useEffect(() => {
    if (phase === 'typing') {
      if (revealedCount < totalLength) {
        const t = setTimeout(() => setRevealedCount(c => c + 1), 70)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('erasing'), 1500)
      return () => clearTimeout(t)
    }
    if (phase === 'erasing') {
      if (revealedCount > 0) {
        const t = setTimeout(() => setRevealedCount(c => c - 1), 35)
        return () => clearTimeout(t)
      }
      setPhraseIdx(i => (i + 1) % PHRASE_SEGMENTS.length)
      setPhase('typing')
    }
  }, [revealedCount, phase, totalLength])

  return { segments, revealedCount, showCursor: phase === 'typing' }
}

// ─── Featured 프로젝트 슬라이드쇼 ────────────────────────────────────────────
function ProjectSlideshow({ projects }: { projects: NotionProject[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [visible, setVisible]     = useState(true)

  useEffect(() => {
    if (projects.length <= 1) return
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setActiveIdx(i => (i + 1) % projects.length)
        setVisible(true)
      }, 380)
    }, 3000)
    return () => clearInterval(timer)
  }, [projects.length])

  if (projects.length === 0) return null
  const project = projects[activeIdx]

  return (
    <Link
      href={`/project/${project.slug}`}
      className="about-hero-glass about-hero-project-card"
      style={{
        display: 'block',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* 썸네일 이미지 */}
      <div style={{
        position: 'relative',
        aspectRatio: '16/10',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.38s ease',
      }}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', fontSize: '0.85rem',
          }}>
            No Image
          </div>
        )}
        {/* 수상 뱃지 */}
        {project.award && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(0,0,0,0.55)',
            color: 'var(--bg)',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: '9999px',
            backdropFilter: 'blur(6px)',
          }}>
            {project.award}
          </span>
        )}
      </div>

      {/* 프로젝트 정보 */}
      <div style={{
        padding: '1.1rem 1.4rem 1.25rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.38s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <h3 style={{
            fontFamily: 'Pretendard, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text)',
            margin: 0,
          }}>
            {project.name}
          </h3>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
            marginLeft: '0.75rem',
          }}>
            {project.period}
          </span>
        </div>
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          margin: '0 0 0.9rem',
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.description}
        </p>

        {/* 도트 인디케이터 */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {projects.map((_, i) => (
            <div
              key={i}
              style={{
                width:  i === activeIdx ? 16 : 6,
                height: 6,
                borderRadius: 9999,
                background: i === activeIdx ? 'var(--accent)' : 'var(--border)',
                transition: 'width 0.35s, background 0.35s',
              }}
            />
          ))}
        </div>
      </div>
    </Link>
  )
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function AboutHeroLanding({ featuredProjects }: { featuredProjects: NotionProject[] }) {
  const itemsRef  = useRef<PhysicsItem[]>([])
  const animRef   = useRef<number>(0)
  const wRef      = useRef(0)
  const hRef      = useRef(0)
  const sceneRef  = useRef<HTMLDivElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const [, setRenderKey] = useState(0)
  const { segments, revealedCount, showCursor } = useLoopingTypewriter()

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return
    wRef.current = el.offsetWidth
    hRef.current = el.offsetHeight
    const ro = new ResizeObserver(e => {
      wRef.current = e[0].contentRect.width
      hRef.current = e[0].contentRect.height
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const tick = useCallback(() => {
    const items = itemsRef.current
    const W = wRef.current
    const H = hRef.current
    let anyAwake = false
    for (const a of items) {
      if (a.sleeping) continue
      anyAwake = true
      a.vy += G; a.vx *= DAMPING; a.vy *= DAMPING
      a.x += a.vx; a.y += a.vy
      a.angle += (a.vx / a.r) * (180 / Math.PI)
    }
    const sleepBefore = items.filter(i => i.sleeping).length
    if (items.length > 0) solveCollisions(items, W, H)
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

  const spawnAll = useCallback(() => {
    if (sceneRef.current) {
      wRef.current = sceneRef.current.offsetWidth
      hRef.current = sceneRef.current.offsetHeight
    }
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    itemsRef.current  = []
    setRenderKey(k => k + 1)

    LANDING_ITEMS.forEach((item, idx) => {
      const t = setTimeout(() => {
        const W = wRef.current
        const r = LEVEL_R[item.level] ?? 44
        const iconColor = ICON_COLOR[item.icon] ?? '#888'
        itemsRef.current.push({
          id: heroId++, r,
          x: r + 8 + Math.random() * Math.max(W - r * 2 - 16, 1),
          y: -r - 4,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 4 + 3,
          angle: Math.random() * 360,
          sleeping: false, sleepFrames: 0,
          name: item.name, iconKey: item.icon,
          iconColor, bgColor: hexToRgba(iconColor, 0.14),
        })
        setRenderKey(k => k + 1)
      }, idx * 100)
      timersRef.current.push(t)
    })
  }, [])

  useEffect(() => {
    const t = setTimeout(spawnAll, 200)
    return () => {
      clearTimeout(t)
      timersRef.current.forEach(clearTimeout)
    }
  }, [spawnAll])

  const items = itemsRef.current

  return (
    <div
      ref={sceneRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .about-hero-glass {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 8px 40px rgba(0,0,0,0.07);
        }
        .dark .about-hero-glass {
          background: rgba(18,18,22,0.80);
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 8px 40px rgba(0,0,0,0.36);
        }

        .about-hero-project-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .about-hero-project-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.13);
        }
        .dark .about-hero-project-card:hover {
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }

        .about-hero-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.4rem;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border);
          background: rgba(255,255,255,0.6);
          color: var(--text);
          font-size: 0.875rem;
          font-weight: 500;
          font-family: Pretendard, sans-serif;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          white-space: nowrap;
        }
        .dark .about-hero-btn {
          background: rgba(255,255,255,0.06);
        }
        .about-hero-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .about-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          width: 100%;
          max-width: 1140px;
          padding: 0 2.5rem;
        }
        @media (max-width: 860px) {
          .about-hero-grid {
            grid-template-columns: 1fr;
            padding: 0 1.5rem;
          }
          .about-hero-right {
            display: none;
          }
        }
      `}</style>

      {/* ── 배경: 물리 아이콘 ── */}
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
              border: '2px solid var(--border-subtle)',
              boxShadow: item.sleeping ? 'var(--shadow-card)' : '0 4px 20px rgba(0,0,0,0.08)',
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
              <span style={{ fontSize: Math.max(iconSize * 0.38, 9), fontWeight: 700, color: item.iconColor, lineHeight: 1 }}>
                {item.name.slice(0, 2)}
              </span>
            )}
          </div>
        )
      })}

      {/* ── 전경: 2-column 레이아웃 ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        <div className="about-hero-grid" style={{ pointerEvents: 'auto' }}>

          {/* LEFT: 텍스트 */}
          <div>
            <p style={{
              fontSize: 'clamp(1.35rem, 2.8vw, 2.2rem)',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
              marginBottom: 0,
              fontFamily: 'Pretendard, sans-serif',
            }}>
              안녕하세요
            </p>

            <h1 style={{
              fontFamily: 'Pretendard, sans-serif',
              fontSize: 'clamp(1.35rem, 2.8vw, 2.2rem)',
              lineHeight: 1.5,
              marginTop: 0,
              marginBottom: '2.5rem',
              minHeight: '3em',
              letterSpacing: '-0.01em',
              whiteSpace: 'pre-line',
            }}>
              {renderSegments(segments, revealedCount)}
              {showCursor && (
                <span style={{
                  display: 'inline-block',
                  width: 3,
                  height: '0.85em',
                  background: 'var(--accent)',
                  marginLeft: 4,
                  verticalAlign: 'text-bottom',
                  borderRadius: 2,
                  animation: 'blink 0.7s step-end infinite',
                }} />
              )}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link href="/about/fe" className="about-hero-btn" style={{ width: 'fit-content' }}>
                프론트엔드 개발자로 만나기 →
              </Link>
              <Link href="/about/be" className="about-hero-btn" style={{ width: 'fit-content' }}>
                백엔드 개발자로 만나기 →
              </Link>
              <Link href="/about/pm" className="about-hero-btn" style={{ width: 'fit-content' }}>
                프로덕트 매니저로 만나기 →
              </Link>
            </div>
          </div>

          {/* RIGHT: Featured 프로젝트 슬라이드쇼 */}
          <div className="about-hero-right">
            <ProjectSlideshow projects={featuredProjects} />
          </div>

        </div>
      </div>
    </div>
  )
}
