'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { NotionProject } from '@/lib/projects'

export default function ProjectHeroBanner({ projects }: { projects: NotionProject[] }) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const dragStartX = useRef<number | null>(null)
  const isDragging = useRef(false)
  const n = projects.length

  const prevIndex = (current - 1 + n) % n
  const nextIndex = (current + 1) % n

  useEffect(() => {
    if (n <= 1) return
    const t = setTimeout(() => setCurrent((c) => (c + 1) % n), 4000)
    return () => clearTimeout(t)
  }, [current, n])

  const onDragStart = (x: number) => {
    dragStartX.current = x
    isDragging.current = false
  }

  const onDragMove = (x: number) => {
    if (dragStartX.current === null) return
    const delta = x - dragStartX.current
    if (Math.abs(delta) > 5) isDragging.current = true
    setDragOffset(delta)
  }

  const onDragEnd = (x: number) => {
    if (dragStartX.current === null) return
    const delta = x - dragStartX.current
    dragStartX.current = null
    setDragOffset(0)
    if (n > 1 && Math.abs(delta) > 50) {
      setCurrent(delta < 0 ? nextIndex : prevIndex)
    }
  }

  if (!projects.length) return null

  const tx = (base: string) =>
    dragOffset ? `translateX(calc(${base} + ${dragOffset}px))` : `translateX(${base})`

  const slideBase: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'var(--bg-secondary)',
    overflow: 'hidden',
  }

  const renderSlide = (project: NotionProject) => (
    <>
      {project.image && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(30,30,30,0.55)' }} />
      <div
        style={{ position: 'absolute', inset: 0, zIndex: 2 }}
        onClick={() => {
          if (isDragging.current) return
          router.push(`/project/${project.slug}`)
        }}
      >
        <div
          className="project-hero-banner-content"
          style={{ height: '100%', padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
            {project.status === '진행중' && (
              <span style={{ fontSize: '0.73rem', fontWeight: 600, padding: '2px 10px', borderRadius: '999px', background: 'rgba(59,130,246,0.25)', color: '#93c5fd' }}>
                진행중
              </span>
            )}
            {project.roles.map((role) => (
              <span key={role} style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>#{role}</span>
            ))}
          </div>
          <h2 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
            {project.name}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.4rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.55 }}>
            {project.description}
          </p>
          {project.award ? (
            <span style={{ fontSize: '0.8rem', color: '#fcd34d' }}>🏆 {project.award}</span>
          ) : project.period ? (
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{project.period}</span>
          ) : null}
        </div>
      </div>
    </>
  )

  return (
    <div
      className="project-hero-banner"
      style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)', height: '300px', cursor: dragStartX.current !== null ? 'grabbing' : 'grab', touchAction: 'pan-y', userSelect: 'none' }}
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMove={(e) => { if (dragStartX.current !== null) onDragMove(e.clientX) }}
      onMouseUp={(e) => onDragEnd(e.clientX)}
      onMouseLeave={(e) => { if (dragStartX.current !== null) onDragEnd(e.clientX) }}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
      onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
    >
      {n > 1 && (
        <div style={{ ...slideBase, transform: tx('-100%') }}>
          {renderSlide(projects[prevIndex])}
        </div>
      )}
      <div style={{ ...slideBase, transform: tx('0%') }}>
        {renderSlide(projects[current])}
      </div>
      {n > 1 && (
        <div style={{ ...slideBase, transform: tx('100%') }}>
          {renderSlide(projects[nextIndex])}
        </div>
      )}

      {/* 인디케이터 */}
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '2rem', display: 'flex', gap: '6px', zIndex: 10 }}>
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); if (i !== current) setCurrent(i) }}
            style={{ width: i === current ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === current ? '#fff' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.2s, background 0.2s' }}
          />
        ))}
      </div>
    </div>
  )
}
