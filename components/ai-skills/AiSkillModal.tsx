'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { AiSkill } from '@/app/data/ai-skills'
import AiSkillCommandBox from '@/components/ai-skills/AiSkillCommandBox'

interface Props {
  skill: AiSkill
  isOpen: boolean
  onClose: () => void
}

export default function AiSkillModal({ skill, isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '10vh 1.5rem',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          padding: '1.75rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
          {skill.name}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {skill.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {skill.variants?.map((variant) => (
            <div key={variant.name}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.3rem' }}>
                {variant.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 0.6rem' }}>
                {variant.description}
              </p>
              <AiSkillCommandBox command={variant.command} />
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
