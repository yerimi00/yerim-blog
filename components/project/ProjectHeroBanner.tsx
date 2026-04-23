'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/app/about/[version]/data'

export default function ProjectHeroBanner({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (projects.length <= 1) return
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % projects.length)
        setAnimating(false)
      }, 300)
    }, 4000)
    return () => clearInterval(timer)
  }, [projects.length])

  if (!projects.length) return null

  const project = projects[current]

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        height: '300px',
        cursor: 'pointer',
      }}
      onClick={() => router.push(`/about/projects/${project.slug}`)}
    >
      {/* 배경 이미지 */}
      {project.image && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src={project.image}
            alt={project.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
          />
        </div>
      )}

      {/* 그레이 오버레이 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(30,30,30,0.55)' }} />

      {/* 콘텐츠 */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          padding: '2.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.3s, transform 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
          {project.status === '진행중' && (
            <span style={{ fontSize: '0.73rem', fontWeight: 600, padding: '2px 10px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)', color: '#e2e8f0' }}>
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

      {/* 인디케이터 */}
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '2rem', display: 'flex', gap: '6px', zIndex: 3 }}>
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
            style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.35)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
