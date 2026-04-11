import { getPostsBySeries } from '@/lib/notion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const revalidate = 60
export const metadata = { title: 'Series', description: '시리즈별로 묶인 글 모음' }

export default async function SeriesPage() {
  const seriesMap = await getPostsBySeries()
  const seriesEntries = Object.entries(seriesMap)

  return (
    <>
      <Header />
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: 'Noto Serif KR, serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.5rem',
            }}
          >
            Series
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {seriesEntries.length}개의 시리즈
          </p>
        </div>

        {seriesEntries.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 0' }}>
            아직 시리즈가 없어요.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {seriesEntries.map(([seriesName, posts]) => (
              <div
                key={seriesName}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                }}
              >
                {/* 시리즈 헤더 */}
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                    }}
                  >
                    {seriesName}
                  </h2>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '20px',
                      padding: '2px 10px',
                    }}
                  >
                    {posts.length}편
                  </span>
                </div>

                {/* 시리즈 내 글 목록 */}
                <div>
                  {posts.map((post, i) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="series-item"
                        style={{
                          padding: '1rem 1.5rem',
                          borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          transition: 'background 0.15s',
                          background: 'transparent',
                        }}
                       
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--accent)',
                            fontFamily: 'JetBrains Mono, monospace',
                            minWidth: '24px',
                          }}
                        >
                          #{i + 1}
                        </span>
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              color: 'var(--text)',
                              marginBottom: '0.2rem',
                            }}
                          >
                            {post.title}
                          </p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {post.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
