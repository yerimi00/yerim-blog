'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { OxQuizData } from '@/lib/interview-widgets'
import { fastTween } from '@/components/motion/presets'
import WidgetFrame, { WidgetButton } from './WidgetFrame'

// 흔한 오해를 O/X로 고르고 바로 해설을 본다
export default function OxQuiz({ data }: { data: OxQuizData }) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => data.items.map(() => null))
  const done = answers.every((a) => a !== null)
  const score = answers.filter((a, i) => a === data.items[i].answer).length

  const pick = (i: number, value: boolean) =>
    setAnswers((prev) => prev.map((a, j) => (j === i && a === null ? value : a)))

  return (
    <WidgetFrame type="ox_quiz">
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.items.map((item, i) => {
          const answered = answers[i]
          const ok = answered === item.answer
          return (
            <li key={item.statement} style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5 }}>{item.statement}</span>
                {([true, false] as const).map((value) => {
                  const chosen = answered === value
                  const isAnswer = answered !== null && item.answer === value
                  return (
                    <motion.button
                      key={String(value)}
                      type="button"
                      aria-label={value ? '맞다(O)' : '틀리다(X)'}
                      aria-pressed={chosen}
                      disabled={answered !== null}
                      onClick={() => pick(i, value)}
                      initial={false}
                      animate={{
                        backgroundColor: isAnswer ? 'var(--success)' : chosen ? 'var(--accent)' : 'var(--surface)',
                        color: isAnswer || chosen ? 'var(--on-primary)' : 'var(--text)',
                      }}
                      whileHover={answered === null ? { scale: 1.08 } : undefined}
                      whileTap={answered === null ? { scale: 0.92 } : undefined}
                      transition={fastTween}
                      style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border)', fontWeight: 800, fontSize: '1rem', cursor: answered === null ? 'pointer' : 'default', flexShrink: 0 }}
                    >
                      {value ? 'O' : 'X'}
                    </motion.button>
                  )
                })}
              </div>
              <AnimatePresence>
                {answered !== null && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ margin: 0, overflow: 'hidden', fontSize: '0.84rem', color: 'var(--text-muted)' }}
                  >
                    <span style={{ display: 'block', paddingTop: '0.5rem' }}>
                      <strong style={{ color: ok ? 'var(--success)' : 'var(--accent)' }}>{ok ? '정답 ' : '오답 '}</strong>
                      {item.explain}
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>
      {done && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
            {score} / {data.items.length} 정답
          </span>
          <WidgetButton onClick={() => setAnswers(data.items.map(() => null))}>다시 풀기</WidgetButton>
        </motion.div>
      )}
    </WidgetFrame>
  )
}
