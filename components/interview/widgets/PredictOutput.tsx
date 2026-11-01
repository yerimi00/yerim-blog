'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import type { PredictOutputData } from '@/lib/interview-widgets'
import { fastTween } from '@/components/motion/presets'
import WidgetFrame, { Explain, WidgetButton } from './WidgetFrame'

// 코드를 보고 출력 결과를 고른 뒤 "실행"하면 콘솔에 한 줄씩 찍히며 정답을 보여준다
export default function PredictOutput({ data }: { data: PredictOutputData }) {
  const [picked, setPicked] = useState<number | null>(null)
  const [ran, setRan] = useState(false)
  const output = data.choices[data.answer_index].split(/\s+/)

  const colorOf = (i: number) => {
    if (!ran) return picked === i ? 'var(--text)' : 'var(--border)'
    if (i === data.answer_index) return 'var(--success)'
    return picked === i ? 'var(--accent)' : 'var(--border)'
  }

  return (
    <WidgetFrame type="predict_output">
      <pre
        style={{
          margin: '0 0 1rem',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-secondary)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.8rem',
          lineHeight: 1.7,
          overflowX: 'auto',
          color: 'var(--text)',
        }}
      >
        <code>{data.code}</code>
      </pre>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>출력 순서를 골라 보세요</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
        {data.choices.map((choice, i) => (
          <motion.button
            key={choice}
            type="button"
            disabled={ran}
            onClick={() => setPicked(i)}
            initial={false}
            animate={{ borderColor: colorOf(i) }}
            whileHover={ran ? undefined : { y: -1 }}
            transition={fastTween}
            style={{
              padding: '0.6rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              borderWidth: 2,
              borderStyle: 'solid',
              background: 'var(--surface)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.82rem',
              color: 'var(--text)',
              cursor: ran ? 'default' : 'pointer',
              textAlign: 'left',
            }}
          >
            {choice}
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <WidgetButton primary disabled={picked === null || ran} onClick={() => setRan(true)}>▶ 실행</WidgetButton>
        {ran && <WidgetButton onClick={() => { setRan(false); setPicked(null) }}>다시 풀기</WidgetButton>}
      </div>

      {ran && (
        <>
          <div
            aria-label="콘솔 출력"
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--text)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              color: 'var(--bg)',
            }}
          >
            {output.map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.18 }}>
                <span style={{ opacity: 0.5 }}>&gt; </span>{line}
              </motion.div>
            ))}
          </div>
          <Explain correct={picked === data.answer_index}>{data.explain}</Explain>
        </>
      )}
    </WidgetFrame>
  )
}
