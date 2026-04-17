'use client'
import { useRouter } from 'next/navigation'
import type { Project } from '@/app/about/[version]/data'

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/about/projects/${project.slug}`)}
      style={{
        position: 'relative',
        aspectRatio: '16/9',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
      }}
    >
      {/* 배경 이미지 (홈 배너와 동일한 방식) */}
      {project.image && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src={project.image}
            alt={project.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.18,
              display: 'block',
            }}
          />
        </div>
      )}

      {/* 콘텐츠 — 하단 배치 */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          padding: '2rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: '0.4rem',
        }}
      >
        {/* 역할 뱃지 + 상태 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
          {project.status === '진행중' && (
            <span
              style={{
                fontSize: '0.73rem',
                fontWeight: 600,
                padding: '2px 10px',
                borderRadius: '999px',
                background: 'rgba(59,130,246,0.12)',
                color: 'var(--accent)',
              }}
            >
              진행중
            </span>
          )}
          {project.roles.map((role) => (
            <span key={role} style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              #{role}
            </span>
          ))}
        </div>

        {/* 프로젝트명 */}
        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text)',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {project.name}
        </h3>

        {/* 설명 */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.55,
          }}
        >
          {project.description}
        </p>

        {/* 기간 + 수상 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {project.period && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{project.period}</span>
          )}
          {project.award && (
            <span style={{ fontSize: '0.8rem', color: '#b45309' }}>
              🏆 {project.award}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
