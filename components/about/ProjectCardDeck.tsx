'use client'
import { useCallback, useEffect, useState } from 'react'
import ProjectCard from './ProjectCard'
import type { Project } from '@/app/about/[version]/data'

export default function ProjectCardDeck({ projects }: { projects: Project[] }) {
  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState(0)
  const total = projects.length

  useEffect(() => setMounted(true), [])

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
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '0', alignItems: 'start' }}>
      {/* 좌측 목차 */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', paddingTop: '0.25rem' }}>
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

      {/* 우측: 카드 + 인디케이터 */}
      <div>
        {/* 카드 영역 */}
        <div style={{ position: 'relative' }}>
          {projects.map((project, i) => (
            <div
              key={project.slug}
              style={{
                position: i === index ? 'relative' : 'absolute',
                inset: 0,
                opacity: i === index ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: i === index ? 'auto' : 'none',
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* 점 인디케이터 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem' }}>
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

      </div>
    </div>
  )
}
