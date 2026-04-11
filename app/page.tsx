import { getAllPosts, getPopularPosts } from '@/lib/notion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroBanner from '@/components/blog/HeroBanner'
import BlogFilter from '@/components/blog/BlogFilter'
import Sidebar from '@/components/blog/Sidebar'

export const revalidate = 60

export default async function HomePage() {
  const [allPosts, popularPosts] = await Promise.all([
    getAllPosts(),
    getPopularPosts(),
  ])

  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* 인기글 배너 슬라이더 */}
        <section style={{ margin: '2rem 0 3rem' }}>
          <HeroBanner posts={popularPosts} />
        </section>

        {/* 본문 + 사이드바 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* 전체 아티클 */}
          <section>
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              전체 아티클 · {allPosts.length}개
            </h2>
            <BlogFilter
              posts={allPosts}
              tags={[...new Set(allPosts.flatMap((p) => p.tags))]}
            />
          </section>

          {/* 사이드바 */}
          <aside style={{ position: 'sticky', top: '80px' }}>
            <Sidebar popularPosts={popularPosts} />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
