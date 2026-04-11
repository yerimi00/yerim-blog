import { getAllPosts, getAllTags } from '@/lib/notion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostCard from '@/components/blog/PostCard'
import BlogFilter from '@/components/blog/BlogFilter'

export const revalidate = 60

export const metadata = {
  title: 'Blog',
  description: '개발, 학습, 회고를 기록합니다',
}

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()])

  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
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
            Blog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            총 {posts.length}개의 글
          </p>
        </div>

        {/* 태그 필터 */}
        <BlogFilter tags={tags} posts={posts} />
      </main>
      <Footer />
    </>
  )
}
