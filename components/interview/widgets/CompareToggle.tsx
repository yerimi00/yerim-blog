'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { CompareToggleData } from '@/lib/interview-widgets'
import { spring } from '@/components/motion/presets'
import WidgetFrame from './WidgetFrame'

// A ↔ B 스위치로 같은 항목의 차이를 비교한다
export default function CompareToggle({ data }: { data: CompareToggleData }) {
  const [side, setSide] = useState<0 | 1>(0)

  return (
    <WidgetFrame type="compare_toggle">
      <div
        role="tablist"
        style={{ position: 'relative', display: 'inline-flex', padding: 4, borderRadius: 'var(--radius-full)', background: 'var(--bg-secondary)', marginBottom: '1rem' }}
      >
        {data.labels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={side === i}
            onClick={() => setSide(i as 0 | 1)}
            style={{ position: 'relative', padding: '0.4rem 1.1rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, color: side === i ? 'var(--on-primary)' : 'var(--text-muted)', zIndex: 1 }}
          >
            {side === i && (
              <motion.span
                layoutId="compare-pill"
                transition={spring.snappy}
                style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-full)', background: 'var(--accent)', zIndex: -1 }}
              />
            )}
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {data.rows.map((row) => (
          <div key={row.aspect} style={{ display: 'grid', gridTemplateColumns: 'minmax(90px, 30%) 1fr', gap: '1rem', padding: '0.7rem 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>{row.aspect}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={side}
                initial={{ opacity: 0, x: side ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: side ? -10 : 10 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: '0.9rem', color: 'var(--text)' }}
              >
                {side === 0 ? row.a : row.b}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
      {data.explain && <p style={{ margin: '0.85rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{data.explain}</p>}
    </WidgetFrame>
  )
}
