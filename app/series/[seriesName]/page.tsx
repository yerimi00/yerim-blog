import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getPostsBySeries } from '@/lib/notion'
import { formatDate } from '@/lib/utils'

export const revalidate = 86400

export async function generateStaticParams() {
  const seriesMap = await getPostsBySeries()
  return Object.keys(seriesMap).map((name) => ({
    seriesName: encodeURIComponent(name),
  }))
}

export async function generateMetadata({ params }: { params: { seriesName: string } }) {
  const name = decodeURIComponent(params.seriesName)
  return { title: `${name} — Series`, description: `${name} 시리즈 글 모음` }
}

export default async function SeriesDetailPage({ params }: { params: { seriesName: string } }) {
  const name = decodeURIComponent(params.seriesName)
  const seriesMap = await getPostsBySeries()
  const posts = seriesMap[name]
  if (!posts) notFound()

  return (
    <>
      <Header />
      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            href="/series"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem' }}
          >
            ← 시리즈 목록
          </Link>
          <h1 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>
            {name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {posts.length}편의 글
          </p>
        </div>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '2rem' }} />

        {/* 포스트 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div
                className="post-row"
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                  padding: '1.25rem 0',
                  borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {/* 번호 */}
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)',
                  fontFamily: 'JetBrains Mono, monospace',
                  paddingTop: '4px', flexShrink: 0, minWidth: '24px',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* 본문 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>#{tag}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 0.25rem', lineHeight: 1.45 }}>
                    {post.title}
                  </p>
                  <p style={{
                    fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {post.description}
                  </p>
                </div>

                {/* 날짜 + 화살표 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {formatDate(post.date)}
                  </span>
                  <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </main>
      <Footer />
    </>
  )
}
