'use client'

import { useEffect, useRef, useState } from 'react'
import type { NotionProject } from '@/lib/projects'
import { usePhysicsStage } from '@/components/physics/usePhysicsStage'
import { TechIcon, ICON_COLOR } from '@/components/about/TechStackGrid'
import { motion } from 'motion/react'
import { MotionLink } from '@/components/motion/MotionProvider'
import BlinkCursor from '@/components/motion/BlinkCursor'
import { fastTween } from '@/components/motion/presets'

// 숙련도 → 공 지름(px). 모바일은 CSS --ball-scale로 줄인다
const LEVEL_SIZE: Record<string, number> = {
  '상': 96, '중상': 84, '중': 72, '초중': 62, '입문': 54,
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
    <MotionLink
      href={`/work/${project.slug}`}
      whileHover={{ y: -3, boxShadow: 'var(--hero-card-hover-shadow)' }}
      transition={{ duration: 0.2 }}
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
      <motion.div initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.38, ease: 'easeInOut' }} style={{
        position: 'relative',
        aspectRatio: '16/10',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
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
      </motion.div>

      {/* 프로젝트 정보 */}
      <motion.div initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.38, ease: 'easeInOut' }} style={{
        padding: '1.1rem 1.4rem 1.25rem',
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
            <motion.div
              key={i}
              initial={false}
              animate={{ width: i === activeIdx ? 16 : 6, backgroundColor: i === activeIdx ? 'var(--accent)' : 'var(--border)' }}
              transition={{ duration: 0.35 }}
              style={{ height: 6, borderRadius: 9999 }}
            />
          ))}
        </div>
      </motion.div>
    </MotionLink>
  )
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function AboutHeroLanding({ featuredProjects }: { featuredProjects: NotionProject[] }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const { active } = usePhysicsStage(stageRef, { dropGap: 28 })
  const { segments, revealedCount, showCursor } = useLoopingTypewriter()

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      <style>{`
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

        /* 호버 그림자 값 (motion whileHover가 읽어 간다) */
        .about-hero-project-card {
          --hero-card-hover-shadow: 0 16px 48px rgba(0,0,0,0.13);
        }
        .dark .about-hero-project-card {
          --hero-card-hover-shadow: 0 16px 48px rgba(0,0,0,0.5);
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
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          white-space: nowrap;
        }
        .dark .about-hero-btn {
          background: rgba(255,255,255,0.06);
        }

        .about-hero-grid {
          pointer-events: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          width: 100%;
          max-width: 1140px;
          padding: 0 2.5rem;
        }
        .about-hero-grid a {
          pointer-events: auto;
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

      {/* ── 배경: 물리 아이콘 (잡아서 던질 수 있음) ── */}
      <div ref={stageRef} className={`physics-stage about-physics-stage${active ? ' is-physics' : ''}`}>
        {LANDING_ITEMS.map((item) => {
          const color = ICON_COLOR[item.icon] ?? 'var(--text-muted)'
          return (
            <div
              key={item.name}
              data-physics=""
              data-shape="circle"
              title={item.name}
              className="about-physics-ball"
              style={{
                '--ball': LEVEL_SIZE[item.level] ?? 72,
                '--ball-color': color,
              } as React.CSSProperties}
            >
              <TechIcon icon={item.icon} name={item.name} size={Math.round((LEVEL_SIZE[item.level] ?? 72) * 0.46)} />
            </div>
          )
        })}
      </div>

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
        <div className="about-hero-grid">

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
                <BlinkCursor style={{ width: 3, height: '0.85em', background: 'var(--accent)', marginLeft: 4, borderRadius: 2 }} />
              )}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <MotionLink href="/about/fe" className="about-hero-btn" style={{ width: 'fit-content' }} whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)' }} transition={{ duration: 0.2 }}>
                프론트엔드 개발자로 만나기 →
              </MotionLink>
              <MotionLink href="/about/be" className="about-hero-btn" style={{ width: 'fit-content' }} whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)' }} transition={{ duration: 0.2 }}>
                백엔드 개발자로 만나기 →
              </MotionLink>
              <MotionLink href="/about/pm" className="about-hero-btn" style={{ width: 'fit-content' }} whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)' }} transition={{ duration: 0.2 }}>
                프로덕트 매니저로 만나기 →
              </MotionLink>
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
