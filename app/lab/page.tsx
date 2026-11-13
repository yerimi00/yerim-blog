import Link from 'next/link'
import InteractionSeriesView from '@/components/blog/InteractionSeriesView'
import { DEMOS } from '@/app/data/interactions/interactions-data'

export const metadata = {
  title: 'Lab',
  description: '직접 만들어 본 인터랙션과 실험 모음',
  alternates: { canonical: '/lab' },
}

export default function LabPage() {
  return (
    <>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="page-title">
            Lab
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            직접 만들어 본 인터랙션과 실험을 모아요.
          </p>
        </div>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>도구</h2>
          <Link
            href="/lab/card-news"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '1rem 1.25rem', maxWidth: '360px', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--surface)' }}
          >
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>카드뉴스 만들기</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>블로그 글·뉴스 기사를 인스타 카드(PNG)로</span>
          </Link>
        </section>

        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>인터랙션</h2>
        {Object.keys(DEMOS).length > 0 ? (
          <InteractionSeriesView />
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 0' }}>
            새 실험을 준비하고 있어요 🧪
          </p>
        )}
      </main>
    </>
  )
}
