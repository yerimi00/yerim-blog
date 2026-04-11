import { getAllPosts, getPostBySlug, getPostContent } from '@/lib/notion'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostBody from '@/components/blog/PostBody'
import GiscusComments from '@/components/blog/GiscusComments'
import TableOfContents, { TocHeading } from '@/components/blog/TableOfContents'
import { formatDate } from '@/lib/utils'

function extractHeadings(markdown: string): TocHeading[] {
  const regex = /^(#{2,3})\s+(.+)$/gm
  const headings: TocHeading[] = []
  let match
  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-가-힣]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
    headings.push({ level, text, id })
  }
  return headings
}

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const content = await getPostContent(post.id)
  const headings = extractHeadings(content)

  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: headings.length ? '1fr 220px' : '760px',
            gap: '4rem',
            alignItems: 'start',
            justifyContent: headings.length ? undefined : 'center',
          }}
        >
          {/* 본문 영역 */}
          <article>
            {/* 포스트 헤더 */}
            <header style={{ marginBottom: '3rem' }}>
              {post.series && (
                <p
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.75rem',
                  }}
                >
                  {post.series}
                </p>
              )}
              <h1
                style={{
                  fontFamily: 'Noto Serif KR, serif',
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: 'var(--text)',
                  marginBottom: '1rem',
                }}
              >
                {post.title}
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                {post.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {formatDate(post.date)}
                </span>
                {post.views !== undefined && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    조회 {post.views}
                  </span>
                )}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>
              </div>
              <hr style={{ marginTop: '2rem', borderColor: 'var(--border)', borderTop: '1px solid' }} />
            </header>

            {/* 본문 */}
            <PostBody content={content} />

            {/* 댓글 */}
            <section style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)' }}>
                댓글
              </h2>
              <GiscusComments />
            </section>
          </article>

          {/* TOC 사이드바 */}
          {headings.length > 0 && (
            <aside style={{ position: 'sticky', top: '80px' }}>
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
