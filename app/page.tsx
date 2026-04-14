import { getAllPosts, getPopularPosts } from '@/lib/notion'
import { getCommentCounts, getRecentComments } from '@/lib/github'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroBanner from '@/components/blog/HeroBanner'
import BlogFilter from '@/components/blog/BlogFilter'
import Sidebar from '@/components/blog/Sidebar'

export const revalidate = 86400

export default async function HomePage() {
  const [allPosts, popularPosts, recentComments] = await Promise.all([
    getAllPosts(),
    getPopularPosts(),
    getRecentComments(),
  ])
  const commentCounts = await getCommentCounts(allPosts.map((p) => p.slug))

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
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
                전체 아티클
              </h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {allPosts.length}개의 글
              </span>
            </div>
            <BlogFilter
              posts={allPosts}
              tags={Array.from(new Set(allPosts.flatMap((p) => p.tags)))}
              commentCounts={commentCounts}
            />
          </section>

          {/* 사이드바 */}
          <aside style={{ position: 'sticky', top: '80px' }}>
            <Sidebar
              popularPosts={popularPosts}
              totalPosts={allPosts.length}
              totalViews={allPosts.reduce((s, p) => s + (p.views ?? 0), 0)}
              seriesCount={new Set(allPosts.map((p) => p.series).filter(Boolean)).size}
              recentComments={recentComments}
            />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
