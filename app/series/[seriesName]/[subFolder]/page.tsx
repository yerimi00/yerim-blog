import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PostBody from '@/components/blog/PostBody'
import { getPostBySlug, getPostContent } from '@/lib/notion'
import { DEMOS, DEMO_COMPONENTS } from '@/app/data/interactions/interactions-data'

export const revalidate = 86400

const INTERACTION_SERIES       = 'interactions'
const INTERACTION_SERIES_LABEL = '인터랙션 모음'

export async function generateStaticParams() {
  return Object.keys(DEMOS).map(slug => ({
    seriesName: INTERACTION_SERIES,
    subFolder:  slug,
  }))
}

export async function generateMetadata({ params }: { params: { subFolder: string } }) {
  const demo = DEMOS[params.subFolder]
  return {
    title:       `${demo?.title ?? params.subFolder} — ${INTERACTION_SERIES_LABEL}`,
    description: demo?.description ?? params.subFolder,
  }
}

export default async function SubFolderPage({ params }: { params: { seriesName: string; subFolder: string } }) {
  const { seriesName, subFolder } = params

  if (seriesName !== INTERACTION_SERIES) notFound()

  const demo = DEMOS[subFolder]
  if (!demo) notFound()

  const Demo = DEMO_COMPONENTS[subFolder]

  const post = await getPostBySlug(subFolder)
  const postContent = post ? await getPostContent(post.id) : null

  return (
    <>
      <Header />
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* 브레드크럼 */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '2rem' }}>
          <Link
            href="/series"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <IoIosArrowBack /> 시리즈
          </Link>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/</span>
          <Link
            href={`/series/${INTERACTION_SERIES}`}
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            {INTERACTION_SERIES_LABEL}
          </Link>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{demo.title}</span>
        </div>

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
