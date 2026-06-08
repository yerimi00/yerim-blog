'use client'

import { useState } from 'react'
import { HiBars3, HiOutlineSquares2X2 } from 'react-icons/hi2'
import ProjectList from '@/components/about/ProjectList'
import ProjectCard from '@/components/about/ProjectCard'
import type { NotionProject } from '@/lib/projects'

export default function ProjectView({ projects }: { projects: NotionProject[] }) {
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
        <div className="project-view-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      )}
    </div>
  )
}
