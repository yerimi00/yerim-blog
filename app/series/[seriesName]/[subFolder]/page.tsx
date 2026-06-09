import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CardStackDemo from '@/components/blog/CardStackDemo'

export const revalidate = 86400

const INTERACTION_SERIES = '인터랙션 모음'

const DEMOS: Record<string, { title: string; description: string }> = {
  '카드 스택 UI': {
    title: '카드 스택 UI',
    description: '드래그 또는 스크롤로 카드를 넘기는 수직 스택 인터랙션',
  },
}

export async function generateStaticParams() {
  return Object.keys(DEMOS).map(name => ({
    seriesName: encodeURIComponent(INTERACTION_SERIES),
    subFolder: encodeURIComponent(name),
  }))
}

export async function generateMetadata({ params }: { params: { subFolder: string } }) {
  const name = decodeURIComponent(params.subFolder)
  const demo = DEMOS[name]
  return {
    title: `${name} — 인터랙션 모음`,
    description: demo?.description ?? name,
  }
}

export default function SubFolderPage({ params }: { params: { seriesName: string; subFolder: string } }) {
  const seriesName = decodeURIComponent(params.seriesName)
  const subFolder = decodeURIComponent(params.subFolder)

  if (seriesName !== INTERACTION_SERIES) notFound()

  const demo = DEMOS[subFolder]
  if (!demo) notFound()

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
            href={`/series/${encodeURIComponent(seriesName)}`}
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            {seriesName}
          </Link>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{subFolder}</span>
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
        <CardStackDemo />

      </main>
      <Footer />
    </>
  )
}
