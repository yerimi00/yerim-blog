'use client'

import { useState } from 'react'
import type { AiSkill } from '@/app/data/ai-skills'
import AiSkillModal from '@/components/ai-skills/AiSkillModal'

export default function AiSkillCard({ skill }: { skill: AiSkill }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasVariants = !!skill.variants && skill.variants.length > 0

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="sidebar-card card-hover"
        style={{ textAlign: 'left', cursor: 'pointer', width: '100%', font: 'inherit' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
            {skill.name}
          </h3>
          {hasVariants && (
            <span className="tag-badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
              {skill.variants!.length}개 명령어
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          {skill.description}
        </p>
      </button>
      <AiSkillModal skill={skill} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
