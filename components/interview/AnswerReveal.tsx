'use client'

import { useEffect, useState } from 'react'

const THINK_SECONDS = 30

// 먼저 생각하고 답 보기 — 30초가 지나거나 버튼을 누르면 children(답변)을 보여준다
export default function AnswerReveal({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false)
  const [left, setLeft] = useState(THINK_SECONDS)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running || revealed) return
    if (left <= 0) {
      setRevealed(true)
      return
    }
    const id = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [running, revealed, left])

  if (revealed) return <>{children}</>

  return (
    <div
      style={{
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
      }}
    >
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.4rem' }}>
        🤔 답을 보기 전에 먼저 떠올려 보세요
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        스스로 생각해 본 뒤에 보면 훨씬 오래 기억돼요.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setRunning(true)}
          disabled={running}
          style={{
            height: '40px',
            padding: '0 1rem',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            cursor: running ? 'default' : 'pointer',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {running ? `⏱️ ${left}초` : `⏱️ ${THINK_SECONDS}초 생각하기`}
        </button>
        <button
          type="button"
          onClick={() => setRevealed(true)}
          style={{
            height: '40px',
            padding: '0 1rem',
            borderRadius: 'var(--radius)',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          답 보기
        </button>
      </div>
    </div>
  )
}
