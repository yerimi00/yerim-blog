'use client'

import { useEffect, useState } from 'react'

export interface TocHeading {
  level: number
  text: string
  id: string
}

export default function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 보이는 heading 중 가장 위에 있는 것을 active로
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <nav aria-label="목차">
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}
      >
        목차
      </p>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: level === 3 ? '0.875rem' : '0' }}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                display: 'block',
                padding: '0.3rem 0.5rem',
                borderRadius: '6px',
                fontSize: level === 2 ? '0.82rem' : '0.78rem',
                fontWeight: activeId === id ? 600 : 400,
                color: activeId === id ? 'var(--accent)' : 'var(--text-muted)',
                textDecoration: 'none',
                lineHeight: 1.4,
                transition: 'color 0.15s, background 0.15s',
                background: activeId === id ? 'var(--tag-bg)' : 'transparent',
                borderLeft: activeId === id ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
