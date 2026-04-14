'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/app/about/[version]/data'


function PlaceholderImage({ name }: { name: string }) {
  const initials = name
    .replace(/[()（）]/g, '')
    .split(/[\s·\-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const colors = [
    ['#3b82f6', '#1d4ed8'],
    ['#8b5cf6', '#5b21b6'],
    ['#10b981', '#047857'],
    ['#f59e0b', '#b45309'],
    ['#ef4444', '#b91c1c'],
    ['#06b6d4', '#0e7490'],
  ]
  const idx = name.charCodeAt(0) % colors.length
  const [from, to] = colors[idx]

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${from}, ${to})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '-0.02em',
        }}
      >
        {initials}
      </span>
    </div>
  )
}

export default function ProjectCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false)
  const router = useRouter()

  return (
    <div
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      style={{ perspective: '1000px', aspectRatio: '16/9', width: '100%' }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── 앞면 ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            border: '1.5px solid var(--border)',
            borderRadius: '14px',
            background: 'var(--bg-secondary)',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            overflow: 'hidden',
          }}
        >
          {/* 이름 + 상태 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
              {project.name}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '2px 9px',
                borderRadius: '999px',
                flexShrink: 0,
                background: project.status === '진행중' ? 'rgba(59,130,246,0.12)' : 'rgba(107,114,128,0.12)',
                color: project.status === '진행중' ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {project.status}
            </span>
          </div>

          {/* 기간 */}
          {project.period && (
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{project.period}</span>
          )}

          {/* 설명 */}
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              margin: 0,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.description}
          </p>

          {/* 역할 뱃지 */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {project.roles.map((role) => (
              <span
                key={role}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                {role}
              </span>
            ))}
          </div>

          {/* 수상 */}
          {project.award && (
            <div
              style={{
                fontSize: '0.72rem',
                color: '#b45309',
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: '6px',
                padding: '3px 9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                alignSelf: 'flex-start',
              }}
            >
              🏆 {project.award}
            </div>
          )}
        </div>

        {/* ── 뒷면 ── */}
        <div
          onClick={() => router.push(`/about/projects/${project.slug}`)}
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '14px',
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1.5px solid var(--accent)',
          }}
        >
          {/* 이미지 or 플레이스홀더 */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {project.image ? (
              <img
                src={project.image}
                alt={project.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <PlaceholderImage name={project.name} />
            )}
          </div>

          {/* 반투명 오버레이 + 텍스트 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1.25rem',
            }}
          >
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', textAlign: 'center' }}>
              {project.name}
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.7)',
                borderRadius: '999px',
                padding: '4px 16px',
                letterSpacing: '0.04em',
              }}
            >
              자세히 보기 →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
