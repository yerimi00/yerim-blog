import { getAllPosts, getPostBySlug, getPostContent } from '@/lib/notion'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostBody from '@/components/blog/PostBody'
import GiscusComments from '@/components/blog/GiscusComments'
import TableOfContents, { TocHeading } from '@/components/blog/TableOfContents'
import PostNavigation from '@/components/blog/PostNavigation'
import ViewTracker from '@/components/blog/ViewTracker'
import ReadingProgress from '@/components/blog/ReadingProgress'
import SocialShare from '@/components/blog/SocialShare'
import RelatedPosts from '@/components/blog/RelatedPosts'
import MediumZoom from '@/components/blog/MediumZoom'
import GoogleAdsense from '@/components/GoogleAdsense'
import { formatDate, calculateReadingTime, getRelatedPosts } from '@/lib/utils'
import { buildBlogPostingSchema, buildBreadcrumbSchema } from '@/lib/structured-data'
import GithubSlugger from 'github-slugger'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yerim.dev'

function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = []
  const slugger = new GithubSlugger()
  let inCodeBlock = false

  for (const line of markdown.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = slugger.slug(text)
      headings.push({ level, text, id })
    }
  }
  return headings
}

export const revalidate = 86400

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
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const [content, allPosts] = await Promise.all([
    getPostContent(post.id),
    getAllPosts(),
  ])
  const headings = extractHeadings(content)
  const idx = allPosts.findIndex((p) => p.slug === post.slug)
  const prev = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const next = idx > 0 ? allPosts[idx - 1] : null
  const relatedPosts = getRelatedPosts(post, allPosts)
  const readingTime = calculateReadingTime(content)
  const postUrl = `${SITE_URL}/blog/${post.slug}`

  const blogPostingSchema = buildBlogPostingSchema(post, postUrl)
  const breadcrumbSchema = buildBreadcrumbSchema(post, postUrl)

  return (
    <>
      <ReadingProgress />
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div
          className="post-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: headings.length ? '1fr 220px' : '760px',
            gap: '4rem',
            alignItems: 'start',
            justifyContent: headings.length ? undefined : 'center',
          }}
        >
          {/* 본문 영역 */}
          <article className="post-article">
            <ViewTracker slug={post.slug} />

            {/* JSON-LD 구조화 데이터 */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* 포스트 헤더 */}
            <header style={{ marginBottom: '3rem' }}>
              {/* 시리즈 + 태그 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
                {post.series && (
                  <Link
                    href={`/series/${encodeURIComponent(post.series)}`}
                    style={{
                      fontSize: '0.73rem',
                      fontWeight: 500,
                      color: 'var(--accent)',
                      background: 'rgba(59, 130, 246, 0.1)',
                      padding: '2px 10px',
                      borderRadius: '20px',
                      textDecoration: 'none',
                    }}
                  >
                    {post.series}
                  </Link>
                )}
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <h1
                className="post-title"
                style={{
                  fontFamily: 'Pretendard, sans-serif',
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

              {/* 메타 + 공유 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {formatDate(post.date)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {readingTime}분 읽기
                  </span>
                  {post.views !== undefined && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      조회 {post.views}
                    </span>
                  )}
                </div>
                <SocialShare title={post.title} url={postUrl} />
              </div>

              <hr style={{ marginTop: '2rem', borderColor: 'var(--border)', borderTop: '1px solid' }} />
            </header>

            {/* 본문 */}
            <PostBody content={content} />

            {/* AdSense — 본문 하단 */}
            <GoogleAdsense
              slot={process.env.NEXT_PUBLIC_ADSENSE_POST_SLOT ?? ''}
              style={{ margin: '2rem 0' }}
            />

            {/* 관련 포스트 */}
            <RelatedPosts posts={relatedPosts} />

            {/* 이전글/다음글 */}
            <PostNavigation prev={prev} next={next} />

            {/* 댓글 */}
            <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)' }}>
                댓글
              </h2>
              <GiscusComments />
            </section>
          </article>

          {/* TOC 사이드바 */}
          {headings.length > 0 && (
            <aside className="post-toc-aside" style={{ position: 'sticky', top: '80px' }}>
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>
      </main>
      <Footer />

      {/* 이미지 줌 */}
      <MediumZoom />
    </>
  )
}
