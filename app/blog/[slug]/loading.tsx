import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PostLoading() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div
          className="post-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 220px',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          {/* 본문 */}
          <article className="post-article">
            {/* 시리즈 + 태그 */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <div className="skeleton" style={{ width: '80px', height: '1.3rem', borderRadius: '20px' }} />
              <div className="skeleton" style={{ width: '52px', height: '1.3rem', borderRadius: '4px' }} />
            </div>

            {/* 제목 (h1 2.2rem) */}
            <div className="skeleton" style={{ width: '80%', height: '2.2rem', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ width: '55%', height: '2.2rem', marginBottom: '1rem' }} />

            {/* 설명 */}
            <div className="skeleton" style={{ width: '95%', height: '1rem', marginBottom: '0.4rem' }} />
            <div className="skeleton" style={{ width: '80%', height: '1rem', marginBottom: '1.25rem' }} />

            {/* 날짜 + 조회수 */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div className="skeleton" style={{ width: '88px', height: '0.85rem' }} />
              <div className="skeleton" style={{ width: '56px', height: '0.85rem' }} />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginBottom: '2.5rem' }} />

            {/* 본문 내용 라인 */}
            {[95, 88, 100, 72, 90, 0, 85, 100, 60, 93, 0, 78, 95, 68, 100].map((w, i) =>
              w === 0 ? (
                <div key={i} style={{ height: '1rem' }} />
              ) : (
                <div
                  key={i}
                  className="skeleton"
                  style={{ width: `${w}%`, height: '0.9rem', marginBottom: '0.55rem' }}
                />
              )
            )}
          </article>

          {/* TOC 사이드바 */}
          <aside className="post-toc-aside" style={{ position: 'sticky', top: '80px' }}>
            <div className="skeleton" style={{ width: '40px', height: '0.75rem', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[72, 88, 60, 80, 52, 76, 64].map((w, i) => (
                <div key={i} className="skeleton" style={{ width: `${w}%`, height: '0.8rem', borderRadius: '4px' }} />
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
