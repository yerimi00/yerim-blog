'use client'
import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { duration } from '@/components/motion/presets'
import ProjectCard from './ProjectCard'
import type { NotionProject } from '@/lib/projects'

export default function ProjectCardDeck({ projects }: { projects: NotionProject[] }) {
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
          <motion.button
            key={project.slug}
            onClick={() => goTo(i)}
            initial={false}
            animate={{
              borderLeftColor: i === index ? 'var(--accent)' : 'rgba(0,0,0,0)',
              opacity: i === index ? 1 : 0.4,
            }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.5rem',
              background: 'none',
              border: 'none',
              borderLeftWidth: '2px',
              borderLeftStyle: 'solid',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
              textAlign: 'left',
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
            <motion.span
              initial={false}
              animate={{ color: i === index ? 'var(--text)' : 'var(--text-muted)' }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: '0.75rem',
                fontWeight: i === index ? 600 : 400,
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
              }}
            >
              {project.name}
            </motion.span>
          </motion.button>
        ))}
      </nav>

      {/* 우측: 카드 + 인디케이터 */}
      <div>
        {/* 카드 영역 */}
        <div style={{ position: 'relative' }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: duration.base, ease: 'easeInOut' }}
              style={{
                position: i === index ? 'relative' : 'absolute',
                inset: 0,
                pointerEvents: i === index ? 'auto' : 'none',
              }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {/* 점 인디케이터 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem' }}>
          {projects.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`${i + 1}번 카드`}
              initial={false}
              animate={{
                width: i === index ? 20 : 6,
                background: i === index ? 'var(--accent)' : 'var(--border)',
              }}
              transition={{ duration: duration.base, ease: 'easeInOut' }}
              style={{
                height: 6,
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
