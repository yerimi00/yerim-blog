'use client'

import { useState } from 'react'
import { HiBars3, HiOutlineSquares2X2 } from 'react-icons/hi2'
import ProjectList from '@/components/about/ProjectList'
import ProjectCard from '@/components/about/ProjectCard'
import type { Project } from '@/app/about/[version]/data'

function ProjectGridCard({ project }: { project: Project }) {
  return (
    <div
      style={{
        aspectRatio: '16/9',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.1rem' }}>🗂️</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {project.name}
        </span>
        {project.status === '진행중' && (
          <span style={{ fontSize: '0.68rem', padding: '1px 8px', borderRadius: '999px', background: 'rgba(59,130,246,0.12)', color: 'var(--accent)', flexShrink: 0 }}>
            진행중
          </span>
        )}
      </div>
      <div style={{ padding: '0.9rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
          {project.description}
        </p>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {project.roles.map((r) => (
            <span key={r} style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>#{r}</span>
          ))}
        </div>
        {project.period && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 'auto' }}>{project.period}</span>
        )}
        {project.award && (
          <span style={{ fontSize: '0.72rem', color: '#b45309' }}>🏆 {project.award}</span>
        )}
      </div>
    </div>
  )
}

export default function ProjectView({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<'list' | 'grid'>('list')

  const iconBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '32px', height: '32px', borderRadius: '6px',
    border: '1px solid var(--border)',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted)',
    cursor: 'pointer', transition: 'all 0.15s', fontSize: '1rem',
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <button style={iconBtnStyle(view === 'list')} onClick={() => setView('list')} title="리스트 뷰">
          <HiBars3 />
        </button>
        <button style={iconBtnStyle(view === 'grid')} onClick={() => setView('grid')} title="그리드 뷰">
          <HiOutlineSquares2X2 />
        </button>
      </div>

      {view === 'list' ? (
        <ProjectList projects={projects} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {projects.map((p) =>
            p.image
              ? <ProjectCard key={p.slug} project={p} />
              : <ProjectGridCard key={p.slug} project={p} />
          )}
        </div>
      )}
    </div>
  )
}
