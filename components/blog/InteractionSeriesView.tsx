'use client'

import { motion } from 'motion/react'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween } from '@/components/motion/presets'
import { DEMOS } from '@/app/data/interactions/interactions-data'

const SUB_FOLDERS = Object.entries(DEMOS).map(([slug, { title }]) => ({ slug, label: title }))

export default function InteractionSeriesView() {
  return (
    <div className="series-folder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem 0.5rem' }}>
      {SUB_FOLDERS.map(({ slug, label }) => (
        <MotionLink
          key={slug}
          href={`/lab/${slug}`}
          style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
          whileHover={{ opacity: 0.75 }}
          transition={fastTween}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/folder.png"
            alt={label}
            style={{ width: '96px', height: 'auto' }}
            whileHover={{ y: -4 }}
            transition={fastTween}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
              {label}
            </div>
          </div>
        </MotionLink>
      ))}
    </div>
  )
}
