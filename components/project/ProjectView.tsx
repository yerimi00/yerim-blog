'use client'

import { useState } from 'react'
import { HiBars3, HiOutlineSquares2X2 } from 'react-icons/hi2'
import { motion } from 'motion/react'
import { fastTween } from '@/components/motion/presets'
import ProjectList from '@/components/about/ProjectList'
import ProjectCard from '@/components/about/ProjectCard'
import type { NotionProject } from '@/lib/projects'

export default function ProjectView({ projects }: { projects: NotionProject[] }) {
  const [view, setView] = useState<'list' | 'grid'>('list')

  const iconBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '32px', height: '32px', borderRadius: '6px',
    border: '1px solid var(--border)',
    cursor: 'pointer', fontSize: '1rem',
  }
  const iconBtnAnimate = (active: boolean) => ({
    background: active ? 'var(--accent)' : 'rgba(0,0,0,0)',
    color: active ? '#fff' : 'var(--text-muted)',
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <motion.button style={iconBtnStyle} initial={false} animate={iconBtnAnimate(view === 'list')} transition={fastTween} onClick={() => setView('list')} title="리스트 뷰">
          <HiBars3 />
        </motion.button>
        <motion.button style={iconBtnStyle} initial={false} animate={iconBtnAnimate(view === 'grid')} transition={fastTween} onClick={() => setView('grid')} title="그리드 뷰">
          <HiOutlineSquares2X2 />
        </motion.button>
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
