'use client'

import { useState } from 'react'
import TabButton from '@/components/motion/TabButton'
import Link from 'next/link'
import type { InterviewQuestion } from '@/lib/interview'

export default function InterviewArchive({ questions }: { questions: InterviewQuestion[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const categories = Array.from(new Set(questions.map((q) => q.category).filter(Boolean)))
  const filtered = selected ? questions.filter((q) => q.category === selected) : questions

  return (
    <div>
      <div className="series-tab-bar">
        {['전체', ...categories].map((tab) => {
          const isActive = tab === '전체' ? !selected : selected === tab
          return (
            <TabButton key={tab} active={isActive} onClick={() => setSelected(tab === '전체' || tab === selected ? null : tab)}>
              {tab}
            </TabButton>
          )
        })}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filtered.map((q) => (
          <li key={q.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <Link
              href={`/interview/${q.slug}`}
              style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', padding: '1rem 0', textDecoration: 'none' }}
            >
              <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', flexShrink: 0, minWidth: '2.5rem' }}>
                {q.number !== null ? `Q${q.number}` : 'Q'}
              </span>
              <span style={{ flex: 1, minWidth: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>
                {q.question}
              </span>
              <span className="post-row-date" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                {q.category}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
