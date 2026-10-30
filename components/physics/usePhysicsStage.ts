'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Body, Constraint } from 'matter-js'

const CLICK_SLOP = 6

type Options = {
  /** 아이템 사이 세로 간격(px). 클수록 하나씩 천천히 떨어지는 느낌 */
  dropGap?: number
}

/**
 * stage 안의 [data-physics] 요소를 matter-js 바디로 만들어 떨어뜨리고, 잡아서 던질 수 있게 한다.
 * - 첫 렌더는 CSS 정적 배치(SSR과 동일) → 마운트 후 물리로 전환. reduced-motion이면 정적 배치 유지
 * - 위치는 DOM transform에 직접 반영해 매 프레임 React 리렌더가 없다
 * - data-shape="circle"이면 원, 아니면 둥근 사각형. 크기는 DOM에서 측정하므로 CSS로 조절한다
 * - 화면에 안 보이면 시뮬레이션을 멈춘다
 */
export function usePhysicsStage(stageRef: React.RefObject<HTMLElement>, { dropGap = 40 }: Options = {}) {
  const [active, setActive] = useState(false)
  // 드래그로 끝난 클릭은 링크 이동을 막기 위해 노출
  const draggedRef = useRef(false)
  const respawnRef = useRef<() => void>(() => {})

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
      const { Engine, Runner, Bodies, Body: BodyApi, Composite, Constraint: ConstraintApi, Events, Sleeping } = Matter

      const engine = Engine.create({ enableSleeping: true, gravity: { x: 0, y: 1, scale: 0.0012 } })
      const wall = 400
      let width = stage.clientWidth
      let height = stage.clientHeight
      const floor = Bodies.rectangle(width / 2, height + wall / 2, width * 4, wall, { isStatic: true })
      const left = Bodies.rectangle(-wall / 2, height / 2, wall, height * 6, { isStatic: true })
      const right = Bodies.rectangle(width + wall / 2, height / 2, wall, height * 6, { isStatic: true })

      const els = Array.from(stage.querySelectorAll<HTMLElement>('[data-physics]'))
      const sizes = els.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }))
      const bodies: Body[] = els.map((el, i) => {
        const { w, h } = sizes[i]
        const common = { restitution: 0.25, friction: 0.25, frictionAir: 0.012, sleepThreshold: 40 }
        return el.dataset.shape === 'circle'
          ? Bodies.circle(0, 0, w / 2, common)
          : Bodies.rectangle(0, 0, w, h, { ...common, chamfer: { radius: h / 2 } })
      })

      // 화면 위쪽에 계단식으로 배치 → 위에서 차례로 떨어진다
      const drop = () => {
        bodies.forEach((b, i) => {
          const r = Math.max(sizes[i].w, sizes[i].h) / 2
          Sleeping.set(b, false)
          BodyApi.setPosition(b, { x: r + Math.random() * Math.max(width - r * 2, 1), y: -r - i * dropGap })
          BodyApi.setVelocity(b, { x: (Math.random() - 0.5) * 3, y: 0 })
          BodyApi.setAngle(b, (Math.random() - 0.5) * 0.8)
          BodyApi.setAngularVelocity(b, 0)
        })
      }
      drop()
      Composite.add(engine.world, [floor, left, right, ...bodies])

      els.forEach((el) => {
        el.style.position = 'absolute'
        el.style.left = '0'
        el.style.top = '0'
      })

      const sync = () => {
        bodies.forEach((b, i) => {
          if (b.isSleeping) return
          const { w, h } = sizes[i]
          els[i].style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`
        })
      }
      sync()
      Events.on(engine, 'afterUpdate', sync)
      const runner = Runner.create()
      Runner.run(runner, engine)

      // 드래그: 요소에만 touch-action: none을 줘서 빈 영역에서는 페이지 스크롤 유지
      let drag: { constraint: Constraint; startX: number; startY: number } | null = null
      const toLocal = (e: PointerEvent) => {
        const rect = stage.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
      }
      const offs = els.map((el, i) => {
        const onDown = (e: PointerEvent) => {
          const p = toLocal(e)
          el.setPointerCapture(e.pointerId)
          draggedRef.current = false
          Sleeping.set(bodies[i], false)
          const constraint = ConstraintApi.create({ pointA: p, bodyB: bodies[i], stiffness: 0.2, damping: 0.1, length: 0 })
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

      // 크기가 바뀌면 벽·바닥을 옮기고, 벽 밖으로 나간 바디를 안으로 들인다
      const ro = new ResizeObserver(() => {
        width = stage.clientWidth
        height = stage.clientHeight
        BodyApi.setPosition(right, { x: width + wall / 2, y: height / 2 })
        BodyApi.setPosition(floor, { x: width / 2, y: height + wall / 2 })
        bodies.forEach((b, i) => {
          const r = Math.max(sizes[i].w, sizes[i].h) / 2
          if (b.position.x > width - r || b.position.y > height - r) {
            Sleeping.set(b, false)
            BodyApi.setPosition(b, { x: Math.min(b.position.x, width - r), y: Math.min(b.position.y, height - r) })
          }
        })
      })
      ro.observe(stage)

      // 화면 밖이면 멈춤
      const io = new IntersectionObserver(([entry]) => {
        runner.enabled = entry.isIntersecting
      })
      io.observe(stage)

      respawnRef.current = drop

      cleanup = () => {
        ro.disconnect()
        io.disconnect()
        offs.forEach((off) => off())
        Events.off(engine, 'afterUpdate', sync)
        Runner.stop(runner)
        Engine.clear(engine)
        respawnRef.current = () => {}
      }
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [active, stageRef, dropGap])

  const respawn = useCallback(() => respawnRef.current(), [])

  return { active, draggedRef, respawn }
}
