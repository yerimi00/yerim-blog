'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { StepDiagramData } from '@/lib/interview-widgets'
import { ease } from '@/components/motion/presets'
import WidgetFrame, { WidgetButton } from './WidgetFrame'

const nodeStyle: React.CSSProperties = {
  flex: '1 1 0',
  minWidth: 0,
  padding: '0.75rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  background: 'var(--bg-secondary)',
  fontSize: '0.85rem',
  fontWeight: 600,
  textAlign: 'center',
  color: 'var(--text)',
  wordBreak: 'keep-all',
}

// "다음"을 누를 때마다 한 단계씩 진행되는 흐름도. 단계마다 from → to로 신호가 이동한다
export default function StepDiagram({ data }: { data: StepDiagramData }) {
  const [step, setStep] = useState(0)
  const current = data.steps[step]
  const last = data.steps.length - 1

  return (
    <WidgetFrame type="step_diagram">
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1rem' }} aria-hidden="true">
        {data.steps.map((_, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ backgroundColor: i <= step ? 'var(--accent)' : 'var(--border)' }}
            style={{ flex: 1, height: 4, borderRadius: 2 }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={nodeStyle}>{current.from}</div>
            <div style={{ position: 'relative', flex: '0 0 72px', height: 24 }} aria-hidden="true">
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 8, height: 2, background: 'var(--border)' }} />
              <span style={{ position: 'absolute', top: 'calc(50% - 6px)', right: 0, color: 'var(--text-muted)', fontSize: 12, lineHeight: 1 }}>▶</span>
              <motion.span
                initial={{ left: 0, opacity: 0 }}
                animate={{ left: 'calc(100% - 12px)', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.9, ease: ease.inOut, repeat: Infinity, repeatDelay: 0.4 }}
                style={{ position: 'absolute', top: 'calc(50% - 5px)', width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }}
              />
            </div>
            <div style={nodeStyle}>{current.to}</div>
          </div>
          <p style={{ margin: '1rem 0 0.25rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
            <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', marginRight: 6 }}>{step + 1}.</span>
            {current.label}
          </p>
          {current.desc && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{current.desc}</p>}
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
        <WidgetButton disabled={step === 0} onClick={() => setStep((s) => s - 1)}>이전</WidgetButton>
        {step < last ? (
          <WidgetButton primary onClick={() => setStep((s) => s + 1)}>다음 단계</WidgetButton>
        ) : (
          <WidgetButton onClick={() => setStep(0)}>처음부터</WidgetButton>
        )}
        <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {step + 1} / {data.steps.length}
        </span>
      </div>
    </WidgetFrame>
  )
}
