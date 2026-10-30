import Link from 'next/link'
import type { InterviewQuestion } from '@/lib/interview'

export default function TodayQuestionCard({ question }: { question: InterviewQuestion }) {
  return (
    <Link
      href={`/interview/${question.slug}`}
      className="card-hover"
      style={{
        display: 'block',
        textDecoration: 'none',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        background: 'var(--surface)',
      }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--accent)' }}>🧑‍💻 오늘의 면접 질문</span>
        {question.category && <span className="tag-badge">{question.category}</span>}
        {question.level && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>난이도 {question.level}</span>}
      </div>
      <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.45, margin: 0 }}>
        {question.question}
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem', marginBottom: 0 }}>
        먼저 생각해 보고 답 확인하기 →
      </p>
    </Link>
  )
}
