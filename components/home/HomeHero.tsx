'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { MotionLink } from '@/components/motion/MotionProvider'
import { ease, spring } from '@/components/motion/presets'

const DOT_GAP = 24
const PUSH_RADIUS = 120

// 천천히 일렁이는 점 물결. 커서 근처 점은 밀려나며 강조색이 된다. 화면에 보일 때만 그린다
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

    const draw = (now: number) => {
      const styles = getComputedStyle(hero)
      const muted = styles.getPropertyValue('--band-muted').trim()
      const accent = styles.getPropertyValue('--accent').trim()
      const time = reduceMotion ? 0 : now / 2400
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
          const wave = Math.max(0, Math.sin(x * 0.009 - y * 0.014 + time))
          ctx.globalAlpha = Math.min(1, 0.05 + wave ** 3 * 0.8 + force * 0.8)
          ctx.fillStyle = force > 0.05 ? accent : muted
          ctx.beginPath()
          ctx.arc(px, py, 1.3 + force * 1.8, 0, Math.PI * 2)
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

export default function HomeHero() {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useDotField(canvasRef, heroRef)

  return (
    <section ref={heroRef} className="home-hero">
      <canvas ref={canvasRef} className="home-hero-canvas" aria-hidden="true" />

      <motion.div
        className="home-hero-text"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ease.out }}
      >
        <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--band-muted)', margin: '0 0 1rem' }}>프론트엔드 개발자 이예림</p>
        <h1 style={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25, color: 'var(--band-text)', margin: '0 0 1rem' }}>
          만들고, 배운 것을 기록해요
        </h1>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--band-muted)', margin: '0 auto 2rem', maxWidth: '520px', wordBreak: 'keep-all' }}>
          프론트엔드를 중심으로 백엔드와 기획 사이를 오가며 만든 것과 배운 것을 모았어요.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <MotionLink href="/blog" className="home-pill home-pill--solid" whileHover={{ y: -2 }} transition={spring.soft}>블로그 읽기</MotionLink>
          <MotionLink href="/about" className="home-pill home-pill--ghost" whileHover={{ y: -2 }} transition={spring.soft}>About</MotionLink>
        </div>
      </motion.div>
    </section>
  )
}
