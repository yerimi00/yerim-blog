import { getAllPosts, getAllSeries } from '@/lib/notion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogFilter from '@/components/blog/BlogFilter'

export const revalidate = 86400

export const metadata = {
  title: 'Blog',
  description: '개발, 학습, 회고를 기록합니다',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const [posts, series] = await Promise.all([getAllPosts(), getAllSeries()])

  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="hand-title">
            Blog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            총 {posts.length}개의 글 ·{' '}
            <Link href="/blog/series" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              시리즈로 모아보기
            </Link>
          </p>
        </div>

        {/* 시리즈 필터 */}
        <BlogFilter series={series} posts={posts} />
      </main>
      <Footer />
    </>
  )
}
