'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import ProjectCard from './ProjectCard'
import type { Project } from '@/app/about/[version]/data'

export default function ProjectCardDeck({ projects }: { projects: Project[] }) {
  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState(0)
  const total = projects.length
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const isFirstMount = useRef(true)

  useEffect(() => setMounted(true), [])

  // index 바뀔 때마다 해당 카드를 스크롤 중앙에 맞춤 (첫 마운트 제외)
  useEffect(() => {
    if (!mounted) return
    if (isFirstMount.current) { isFirstMount.current = false; return }
    cardRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [index, mounted])

  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])
  const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total])
  const goTo = useCallback((i: number) => setIndex(i), [])

  useEffect(() => {
    if (!mounted) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted, next, prev])

  // SSR fallback
  if (!mounted) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    )
  }

  return (
    <div className="project-deck-grid" style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0', alignItems: 'start' }}>
      {/* 스크롤바 숨김 */}
      <style>{`
        .project-carousel::-webkit-scrollbar { display: none; }
      `}</style>

      {/* 좌측 목차 */}
      <nav className="project-toc-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', paddingTop: '0.25rem', overflow: 'visible', position: 'relative', zIndex: 1 }}>
        {projects.map((project, i) => (
          <button
            key={project.slug}
            onClick={() => goTo(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.5rem',
              background: 'none',
              border: 'none',
              borderLeft: i === index ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.2s, opacity 0.2s',
              opacity: i === index ? 1 : 0.4,
            }}
          >
            <span style={{
              fontSize: '0.62rem',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--accent)',
              flexShrink: 0,
              opacity: i === index ? 1 : 0.5,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: i === index ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: i === index ? 600 : 400,
              lineHeight: 1.3,
              transition: 'color 0.2s, font-weight 0.2s',
              whiteSpace: 'nowrap',
            }}>
              {project.name}
            </span>
          </button>
        ))}
      </nav>

      {/* 우측: 캐러셀 + 인디케이터 */}
      <div>
        {/* 캐러셀 트랙 */}
        <div
          className="project-carousel"
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            paddingInline: '10%',
            paddingBottom: '56px',
          }}
        >
          {projects.map((project, i) => {
            const dist = Math.abs(i - index)
            const isActive = dist === 0
            const isAdjacent = dist === 1

            return (
              <div
                key={project.slug}
                ref={(el) => { cardRefs.current[i] = el }}
                style={{
                  minWidth: '80%',
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                  borderRadius: '14px',
                  transform: `scale(${isActive ? 1 : isAdjacent ? 0.88 : 0.78}) translateY(${dist * 5}px)`,
                  opacity: isActive ? 1 : isAdjacent ? 0.55 : 0.2,
                  boxShadow: isActive ? '0 16px 40px rgba(0,0,0,0.12)' : 'none',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, box-shadow 0.4s ease',
                  transformOrigin: i < index ? 'right center' : i > index ? 'left center' : 'center',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <ProjectCard project={project} />
              </div>
            )
          })}
        </div>

        {/* 점 인디케이터 + 카운터 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '-0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`${i + 1}번 카드`}
                style={{
                  width: i === index ? 20 : 6,
                  height: 6,
                  borderRadius: '999px',
                  background: i === index ? 'var(--accent)' : 'var(--border)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.3s ease, background 0.3s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          <span style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}
