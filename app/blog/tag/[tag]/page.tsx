import { getAllPosts, getAllTags } from '@/lib/notion'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostCard from '@/components/blog/PostCard'

export const revalidate = 3600

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }))
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  return {
    title: `#${tag}`,
    description: `${tag} 태그가 달린 글 모음`,
  }
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  const allPosts = await getAllPosts()
  const posts = allPosts.filter((p) => p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()))

  if (posts.length === 0) notFound()

  return (
    <>
      <Header />
      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'Pretendard, sans-serif',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '0.4rem',
          }}>
            #{tag}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{posts.length}개의 글</p>
        </div>
        <hr style={{ borderColor: 'var(--border)', marginBottom: '1rem' }} />
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
