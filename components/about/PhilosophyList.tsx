'use client'

import { useEffect, useRef } from 'react'

type PhilosophyItem = { title: string; desc: string }

export default function PhilosophyList({ items }: { items: PhilosophyItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const els = Array.from(container.querySelectorAll<HTMLElement>('.philosophy-item'))
    const observers: IntersectionObserver[] = []

    els.forEach((el, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('philosophy-item--visible'), i * 140)
            observer.disconnect()
          }
        },
        { threshold: 0.15 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <div ref={containerRef}>
      {items.map(({ title, desc }, i) => (
        <div key={title} className="philosophy-item">
          <span className="philosophy-item-num">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <p className="philosophy-item-title">{title}</p>
            <p className="philosophy-item-desc">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
