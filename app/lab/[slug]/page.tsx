import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostBody from '@/components/blog/PostBody'
import { getPostBySlug, getPostContent } from '@/lib/notion'
import { DEMOS, DEMO_COMPONENTS } from '@/app/data/interactions/interactions-data'

export const revalidate = 86400

export async function generateStaticParams() {
  return Object.keys(DEMOS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const demo = DEMOS[params.slug]
  return {
    title:       `${demo?.title ?? params.slug} — Lab`,
    description: demo?.description ?? params.slug,
    alternates:  { canonical: `/lab/${params.slug}` },
  }
}

export default async function LabDetailPage({ params }: { params: { slug: string } }) {
  const demo = DEMOS[params.slug]
  if (!demo) notFound()

  const Demo = DEMO_COMPONENTS[params.slug]

  const post = await getPostBySlug(params.slug)
  const postContent = post ? await getPostContent(post.id) : null

  return (
    <>
      <Header />
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        <Link
          href="/lab"
          style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginBottom: '2rem' }}
        >
          <IoIosArrowBack /> Lab
        </Link>

        {/* 제목 */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>
            {demo.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {demo.description}
          </p>
        </div>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />

        {/* 데모 */}
        <Demo />

        {/* 블로그 본문 */}
        {postContent && (
          <>
            <hr style={{ borderColor: 'var(--border)', margin: '3rem 0 2.5rem' }} />
            <PostBody content={postContent} />
          </>
        )}

      </main>
      <Footer />
    </>
  )
}
