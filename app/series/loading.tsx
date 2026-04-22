import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

function PostItemSkeleton({ titleWidth }: { titleWidth: number }) {
  return (
    <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
      {/* 번호 + 태그 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
        <div className="skeleton" style={{ width: '20px', height: '0.75rem' }} />
        <div className="skeleton" style={{ width: '44px', height: '0.75rem' }} />
      </div>
      {/* 제목 */}
      <div className="skeleton" style={{ width: `${titleWidth}%`, height: '0.95rem', marginBottom: '0.25rem' }} />
      {/* 설명 */}
      <div className="skeleton" style={{ width: `${Math.min(titleWidth + 15, 90)}%`, height: '0.8rem', marginBottom: '0.35rem' }} />
      {/* 날짜 */}
      <div className="skeleton" style={{ width: '64px', height: '0.75rem' }} />
    </div>
  )
}

function SeriesCardSkeleton({
  titleWidth,
  open,
  postCount,
}: {
  titleWidth: number
  open: boolean
  postCount: number
}) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
      }}
    >
      {/* 헤더 행 */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: open ? '1px solid var(--border)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: `${titleWidth}px`, height: '1.05rem' }} />
          <div className="skeleton" style={{ width: '36px', height: '1.2rem', borderRadius: '20px' }} />
        </div>
        {/* 회전된 chevron 자리 */}
        <div
          className="skeleton"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : undefined,
          }}
        />
      </div>

      {/* 펼쳐진 포스트 목록 */}
      {open && (
        <div>
          {Array.from({ length: postCount }).map((_, i) => (
            <div
              key={i}
              style={{
                borderBottom: i < postCount - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <PostItemSkeleton titleWidth={[68, 80, 55, 75, 62][i % 5]} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SeriesLoading() {
  const cards = [
    { titleWidth: 148, open: true, postCount: 3 },
    { titleWidth: 116, open: false, postCount: 0 },
    { titleWidth: 136, open: true, postCount: 2 },
    { titleWidth: 100, open: false, postCount: 0 },
  ]

  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="skeleton" style={{ width: '96px', height: '2rem', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ width: '88px', height: '0.9rem' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {cards.map((card, i) => (
            <SeriesCardSkeleton key={i} {...card} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
