import { DEMOS } from '@/app/data/interactions/interactions-data'

const SUB_FOLDERS = Object.entries(DEMOS).map(([slug, { title }]) => ({ slug, label: title }))

// 상세 페이지를 준비 중이라 카드는 링크 없이 보여주기만 한다
export default function InteractionSeriesView() {
  return (
    <div className="series-folder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem 0.5rem' }}>
      {SUB_FOLDERS.map(({ slug, label }) => (
        <div key={slug} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/folder.png" alt="" style={{ width: '96px', height: 'auto' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
              {label}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>준비 중</div>
          </div>
        </div>
      ))}
    </div>
  )
}
