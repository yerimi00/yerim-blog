'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Body, Constraint, Engine } from 'matter-js'
import TypewriterText from '@/components/about/TypewriterText'

const HERO_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'GitHub', href: 'https://github.com/yerimi00' },
  { label: 'Velog', href: 'https://velog.io/@yerimi00' },
]

const DOT_GAP = 22
const PUSH_RADIUS = 110
const CLICK_SLOP = 6

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

// 태그 칩이 떨어져 쌓이고, 잡아서 던질 수 있는 물리 영역.
// 첫 렌더는 정적인 칩 목록(SSR과 동일) → 마운트 후 물리로 전환
function usePhysicsChips(
  stageRef: React.RefObject<HTMLDivElement>,
  chipRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>,
  draggedRef: React.MutableRefObject<boolean>,
  count: number,
) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setActive(true)
  }, [])

  useEffect(() => {
    if (!active) return
    const stage = stageRef.current
    if (!stage) return
    let cleanup = () => {}
    let cancelled = false

    import('matter-js').then(({ default: Matter }) => {
      if (cancelled) return
      const { Engine, Runner, Bodies, Composite, Constraint, Body } = Matter
      const engine: Engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0012 } })
      const width = stage.clientWidth
      const height = stage.clientHeight
      const wall = 200
      const floor = Bodies.rectangle(width / 2, height + wall / 2, width * 3, wall, { isStatic: true })
      const left = Bodies.rectangle(-wall / 2, height / 2, wall, height * 4, { isStatic: true })
      const right = Bodies.rectangle(width + wall / 2, height / 2, wall, height * 4, { isStatic: true })

      const chips = chipRefs.current.slice(0, count).filter((el): el is HTMLAnchorElement => !!el)
      const bodies: Body[] = chips.map((el, i) => {
        const w = el.offsetWidth
        const h = el.offsetHeight
        const x = Math.min(width - w / 2, Math.max(w / 2, Math.random() * width))
        return Bodies.rectangle(x, -60 - i * 45, w, h, {
          chamfer: { radius: h / 2 },
          restitution: 0.35,
          friction: 0.3,
          angle: (Math.random() - 0.5) * 0.6,
        })
      })
      Composite.add(engine.world, [floor, left, right, ...bodies])

      chips.forEach((el) => {
        el.style.position = 'absolute'
        el.style.left = '0'
        el.style.top = '0'
      })

      // 칩 위치를 DOM transform에 반영
      const sync = () => {
        bodies.forEach((b, i) => {
          const el = chips[i]
          el.style.transform = `translate(${b.position.x - el.offsetWidth / 2}px, ${b.position.y - el.offsetHeight / 2}px) rotate(${b.angle}rad)`
        })
      }
      Matter.Events.on(engine, 'afterUpdate', sync)
      const runner = Runner.create()
      Runner.run(runner, engine)

      // 칩 드래그 — 칩에만 touch-action: none을 줘서 빈 영역에서는 페이지 스크롤 유지
      let drag: { constraint: Constraint; startX: number; startY: number } | null = null
      const toLocal = (e: PointerEvent) => {
        const rect = stage.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
      }
      const handlers = chips.map((el, i) => {
        const onDown = (e: PointerEvent) => {
          const p = toLocal(e)
          el.setPointerCapture(e.pointerId)
          draggedRef.current = false
          const constraint = Constraint.create({ pointA: p, bodyB: bodies[i], stiffness: 0.15, damping: 0.1, length: 0 })
          Composite.add(engine.world, constraint)
          drag = { constraint, startX: p.x, startY: p.y }
        }
        const onMove = (e: PointerEvent) => {
          if (!drag) return
          const p = toLocal(e)
          drag.constraint.pointA = p
          if (Math.hypot(p.x - drag.startX, p.y - drag.startY) > CLICK_SLOP) draggedRef.current = true
        }
        const onUp = () => {
          if (!drag) return
          Composite.remove(engine.world, drag.constraint)
          drag = null
        }
        el.addEventListener('pointerdown', onDown)
        el.addEventListener('pointermove', onMove)
        el.addEventListener('pointerup', onUp)
        el.addEventListener('pointercancel', onUp)
        return () => {
          el.removeEventListener('pointerdown', onDown)
          el.removeEventListener('pointermove', onMove)
          el.removeEventListener('pointerup', onUp)
          el.removeEventListener('pointercancel', onUp)
        }
      })

      // 너비가 바뀌면 오른쪽 벽·바닥만 옮긴다
      const ro = new ResizeObserver(() => {
        const w = stage.clientWidth
        Body.setPosition(right, { x: w + wall / 2, y: right.position.y })
        Body.setPosition(floor, { x: w / 2, y: floor.position.y })
      })
      ro.observe(stage)

      cleanup = () => {
        ro.disconnect()
        handlers.forEach((off) => off())
        Runner.stop(runner)
        Engine.clear(engine)
      }
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [active, stageRef, chipRefs, draggedRef, count])

  return active
}

export default function HomeHero({ tags }: { tags: string[] }) {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const draggedRef = useRef(false)

  useDotField(canvasRef, heroRef)
  const physics = usePhysicsChips(stageRef, chipRefs, draggedRef, tags.length)

  return (
    <section ref={heroRef} className="home-hero">
      <canvas ref={canvasRef} className="home-hero-canvas" aria-hidden="true" />

      <div className="home-hero-text">
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>안녕하세요,</p>
        <h1 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 0.6rem', minHeight: '1.3em' }}>
          <TypewriterText text="이예림입니다." />
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

      <div ref={stageRef} className={`home-hero-stage${physics ? ' is-physics' : ''}`}>
        {tags.map((tag, i) => (
          <Link
            key={tag}
            ref={(el) => { chipRefs.current[i] = el }}
            href={`/blog/tag/${encodeURIComponent(tag)}`}
            className="home-hero-chip"
            draggable={false}
            onClick={(e) => {
              // 드래그로 끝난 경우 이동하지 않는다
              if (draggedRef.current) e.preventDefault()
            }}
          >
            #{tag}
          </Link>
        ))}
      </div>

      {physics && <p className="home-hero-hint">태그를 잡아서 던져 보세요</p>}
    </section>
  )
}
