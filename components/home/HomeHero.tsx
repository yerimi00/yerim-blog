'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import TypewriterText from '@/components/about/TypewriterText'
import { usePhysicsStage } from '@/components/physics/usePhysicsStage'
import { MotionLink } from '@/components/motion/MotionProvider'
import HandUnderline from '@/components/motion/HandUnderline'
import { fastTween } from '@/components/motion/presets'

const HERO_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'GitHub', href: 'https://github.com/yerimi00' },
  { label: 'Velog', href: 'https://velog.io/@yerimi00' },
]

const DOT_GAP = 22
const PUSH_RADIUS = 110

// 커서 근처 점이 밀려나는 배경. 화면에 보일 때만 그린다
function useDotField(canvasRef: React.RefObject<HTMLCanvasElement>, heroRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const canvas = canvasRef.current
    const hero = heroRef.current
    if (!canvas || !hero) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -9999, y: -9999 }
    // 포인터 위치를 부드럽게 따라가는 값
    const eased = { x: -9999, y: -9999 }
    let width = 0
    let height = 0
    let raf = 0
    let visible = true

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      width = hero.clientWidth
      height = hero.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const styles = getComputedStyle(hero)
      const muted = styles.getPropertyValue('--text-muted').trim()
      const accent = styles.getPropertyValue('--accent').trim()
      eased.x += (pointer.x - eased.x) * 0.15
      eased.y += (pointer.y - eased.y) * 0.15

      ctx.clearRect(0, 0, width, height)
      for (let y = DOT_GAP / 2; y < height; y += DOT_GAP) {
        for (let x = DOT_GAP / 2; x < width; x += DOT_GAP) {
          const dx = x - eased.x
          const dy = y - eased.y
          const dist = Math.hypot(dx, dy)
          const force = reduceMotion ? 0 : Math.max(0, 1 - dist / PUSH_RADIUS)
          const px = x + (dist ? (dx / dist) * force * 14 : 0)
          const py = y + (dist ? (dy / dist) * force * 14 : 0)
          ctx.globalAlpha = 0.25 + force * 0.75
          ctx.fillStyle = force > 0.05 ? accent : muted
          ctx.beginPath()
          ctx.arc(px, py, 1.2 + force * 1.8, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      if (visible) raf = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      if (eased.x < -999) {
        eased.x = pointer.x
        eased.y = pointer.y
      }
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(draw)
    })
    const ro = new ResizeObserver(resize)

    resize()
    ro.observe(hero)
    io.observe(hero)
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
    }
  }, [canvasRef, heroRef])
}

export default function HomeHero({ tags }: { tags: string[] }) {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useDotField(canvasRef, heroRef)
  const { active: physics, draggedRef } = usePhysicsStage(stageRef, { dropGap: 45 })

  return (
    <section ref={heroRef} className="home-hero">
      <canvas ref={canvasRef} className="home-hero-canvas" aria-hidden="true" />

      <div className="home-hero-text">
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>안녕하세요,</p>
        <h1 className="hand" style={{ fontSize: '3.2rem', lineHeight: 1.1, color: 'var(--text)', margin: '0 0 0.6rem', minHeight: '1.1em' }}>
          {/* 타이핑(7글자 × 80ms)이 끝난 뒤 밑줄을 긋는다 */}
          <span style={{ position: 'relative' }}>
            <TypewriterText text="이예림입니다." />
            <HandUnderline delay={0.75} />
          </span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 0.9rem', maxWidth: '420px' }}>
          프론트엔드를 중심으로 백엔드와 기획 사이를 오가며 만들고, 배운 것을 기록해요.
        </p>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
          {HERO_LINKS.map(({ label, href }) =>
            href.startsWith('http') ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{label}</a>
            ) : (
              <Link key={label} href={href} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{label}</Link>
            )
          )}
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

      {physics && <p className="home-hero-hint">태그를 잡아서 던져 보세요</p>}
    </section>
  )
}
