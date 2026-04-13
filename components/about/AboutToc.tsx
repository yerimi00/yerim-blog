'use client'

import { useEffect, useState } from 'react'

const TOC_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education & Experience' },
  { id: 'stack', label: 'Tech Stack' },
  { id: 'awards', label: 'Awards' },
  { id: 'project', label: 'Project' },
]

export default function AboutToc() {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    )

    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav aria-label="페이지 목차">
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
        {TOC_ITEMS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              style={{
                display: 'block',
                padding: '0.25rem 0.25rem',
                fontSize: '0.82rem',
                fontWeight: activeId === id ? 600 : 400,
                color: activeId === id ? 'var(--text)' : 'var(--text-muted)',
                textDecoration: 'none',
                lineHeight: 1.5,
                transition: 'color 0.15s',
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
