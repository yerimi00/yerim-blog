'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { AiSkillCategory } from '@/app/data/ai-skills'
import AiSkillSection from '@/components/ai-skills/AiSkillSection'
import { duration, fastTween } from '@/components/motion/presets'

// 직접 만든 자동화 외에 평소 쓰는 도구는 접어 둔다
export default function AiSkillsMore({ categories }: { categories: AiSkillCategory[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ color: 'var(--accent)' }}
        transition={fastTween}
        style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}
      >
        평소 쓰는 도구 {open ? '접기 ↑' : '더 보기 ↓'}
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: duration.base }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '1.75rem' }}>
              {categories.map((category) => (
                <AiSkillSection key={category.title} category={category} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
