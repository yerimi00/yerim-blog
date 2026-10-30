import InteractionSeriesView from '@/components/blog/InteractionSeriesView'
import { DEMOS } from '@/app/data/interactions/interactions-data'

export const metadata = {
  title: 'Lab',
  description: '직접 만들어 본 UI 인터랙션 모음. 눌러보고 끌어보면서 확인해 보세요.',
  alternates: { canonical: '/lab' },
}

export default function LabPage() {
  return (
    <>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="hand-title">
            Lab
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            직접 만들어 본 UI 인터랙션 {Object.keys(DEMOS).length}개. 눌러보고 끌어보면서 확인해 보세요.
          </p>
        </div>
        <InteractionSeriesView />
      </main>
    </>
  )
}
