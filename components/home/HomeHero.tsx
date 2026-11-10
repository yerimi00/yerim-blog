'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react'
import type { Post } from '@/types'
import { usePhysicsStage } from '@/components/physics/usePhysicsStage'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween, spring } from '@/components/motion/presets'
import { seriesColor, toYYMM } from '@/lib/utils'
import { ArrowRight } from '@/components/ui/text-arrows'

export type HeroPost = Pick<Post, 'slug' | 'title' | 'date' | 'series'>

const LIFT_RADIUS = 110
const MAX_LIFT = 2.2

const SAY = ['안녕하세요! 프론트엔드 개발자 이예림이에요.', '프론트엔드를 중심으로 백엔드와 기획 사이를 오가며 만든 것과 배운 것을 모았어요.']
const SAY_DELAY = 0.5
const TYPE_START = 0.8
const TYPE_STEP = 0.035

// 글자를 하나씩 보이게 한다. 실제 글자는 처음부터 DOM에 있어 검색·스크린리더에 영향이 없다
function Typed({ text, from }: { text: string; from: number }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0, delay: TYPE_START + (from + i) * TYPE_STEP }}>
          {ch}
        </motion.span>
      ))}
    </>
  )
}

const heroLink: React.CSSProperties = { fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }

function Tick({ post, mouseX, active, still, onEnter }: { post: HeroPost; mouseX: MotionValue<number>; active: boolean; still: boolean; onEnter: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const lift = useTransform(mouseX, (x) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect || still || !Number.isFinite(x)) return 1
    const near = Math.max(0, 1 - Math.abs(x - (rect.left + rect.width / 2)) / LIFT_RADIUS)
    return 1 + near * near * MAX_LIFT
  })
  const scaleY = useSpring(lift, spring.soft)

  return (
    <Link
      ref={ref}
      href={`/blog/${post.slug}`}
      className="home-strip-tick"
      tabIndex={-1}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onEnter()
      }}
    >
      <motion.span
        className="home-strip-bar"
        style={{ scaleY }}
        initial={false}
        animate={{ backgroundColor: active ? seriesColor(post.series ?? '') : 'var(--outline-variant)' }}
        transition={fastTween}
      />
    </Link>
  )
}

// 캐릭터 위로 태그가 떨어져 쌓이고, 그 아래 지금까지 쓴 글을 오래된 순으로 늘어놓은 눈금. 커서 근처 눈금이 솟고 그 글 제목이 위에 뜬다
export default function HomeHero({ posts, tags }: { posts: HeroPost[]; tags: string[] }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const { active: physics, draggedRef } = usePhysicsStage(stageRef, { dropGap: 45 })
  const ordered = [...posts].reverse()
  const latest = ordered.length - 1
  const [active, setActive] = useState(latest)
  const mouseX = useMotionValue(Infinity)
  const still = useReducedMotion() ?? false
  const current = ordered[active]

  return (
    <section className="home-hero">
      <div className="home-hero-play">
      <div className="home-hero-head">
        <h1 className="visually-hidden">예림 개발 블로그 — 만들고, 배운 것을 기록해요</h1>
        {/* 손 흔드는 영상(배경 투명 animated WebP)을 한 번 재생하고 마지막 장면에서 멈춘다. 동작 줄이기 설정이면 정지 이미지 */}
        <picture className="home-hero-photo">
          <source media="(prefers-reduced-motion: reduce)" srcSet="/hero-wave-still.png" />
          <source media="(max-width: 768px)" srcSet="/hero-wave-sm.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero-wave.webp" alt="손을 흔들며 인사하는 이예림 캐릭터" width={520} height={558} />
        </picture>
        <div className="home-hero-side">
          {/* PC에서는 캐릭터가 말하는 말풍선. 손을 흔든 뒤 뜨고 글자가 하나씩 찍힌다 */}
          <motion.div
            className="home-hero-say"
            style={{ transformOrigin: '0% 30%' }}
            initial={{ opacity: 0, scale: 0.85, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ ...spring.bouncy, delay: SAY_DELAY }}
          >
            <p className="visually-hidden">{SAY.join(' ')}</p>
            <p aria-hidden="true" style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.6, color: 'var(--text)', margin: '0 0 0.35rem' }}>
              <Typed text={SAY[0]} from={0} />
            </p>
            <p aria-hidden="true" style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>
              <Typed text={SAY[1]} from={SAY[0].length} />
            </p>
          </motion.div>
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.1rem' }}>
            <Link href="/blog" style={heroLink}>블로그 <ArrowRight /></Link>
            <Link href="/about" style={heroLink}>About <ArrowRight /></Link>
          </div>
        </div>
      </div>

      <div ref={stageRef} className={`physics-stage home-hero-stage${physics ? ' is-physics' : ''}`}>
        {tags.map((tag) => (
          <MotionLink
            key={tag}
            data-physics=""
            href={`/blog/tag/${encodeURIComponent(tag)}`}
            className="home-hero-chip"
            draggable={false}
            whileHover={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
            transition={fastTween}
            onClick={(e) => {
              // 드래그로 끝난 경우 이동하지 않는다
              if (draggedRef.current) e.preventDefault()
            }}
          >
            #{tag}
          </MotionLink>
        ))}
      </div>
      </div>

      {current && (
        <div className="home-strip">
          <p className="home-strip-label">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0 }}>{toYYMM(current.date)}</span>
            <span className="home-strip-title">{current.title}</span>
            <span style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--text-muted)' }}>기록 {ordered.length}개</span>
          </p>
          <div
            className="home-strip-track"
            aria-hidden="true"
            onPointerMove={(e) => {
              if (e.pointerType === 'mouse') mouseX.set(e.clientX)
            }}
            onPointerLeave={() => {
              mouseX.set(Infinity)
              setActive(latest)
            }}
          >
            {ordered.map((post, i) => (
              <Tick key={post.slug} post={post} mouseX={mouseX} active={i === active} still={still} onEnter={() => setActive(i)} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
