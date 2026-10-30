'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import type { AiSkill } from '@/app/data/ai-skills'
import { fastTween } from '@/components/motion/presets'
import AiSkillCommandBox from '@/components/ai-skills/AiSkillCommandBox'

interface Props {
  skill: AiSkill
  isOpen: boolean
  onClose: () => void
}

export default function AiSkillModal({ skill, isOpen, onClose }: Props) {
  // 포털은 document가 있어야 하므로 마운트 후에만 렌더 (닫힘 애니메이션 유지용으로 항상 포털 유지)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
    {isOpen && (
    <motion.div
      key="ai-skill-modal"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fastTween}
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
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={fastTween}
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

        {skill.variants ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {skill.variants.map((variant) => (
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
        ) : (
          <AiSkillCommandBox command={skill.command} />
        )}
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>,
    document.body
  )
}
