import { getAllPosts, getAllSeries } from '@/lib/notion'
import BlogFilter from '@/components/blog/BlogFilter'
import BlogViewSwitch from '@/components/blog/BlogViewSwitch'

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
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="page-title">
              Blog
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              총 {posts.length}개의 글
            </p>
          </div>
          <BlogViewSwitch active="list" />
        </div>

        {/* 시리즈 필터 */}
        <BlogFilter series={series} posts={posts} />
      </main>
    </>
  )
}
