import { getPostsBySeries } from '@/lib/notion'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import SeriesView from '@/components/blog/SeriesView'

export const revalidate = 86400
export const metadata = { title: 'Series', description: '시리즈별로 묶인 글 모음', alternates: { canonical: '/blog/series' } }

export default async function SeriesPage() {
  const seriesMap = await getPostsBySeries()
  // 인터랙션 모음은 /lab으로 승격
  const seriesEntries = Object.entries(seriesMap).filter(([name]) => name !== 'interactions')

  return (
    <>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            href="/blog"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem' }}
          >
            <IoIosArrowBack /> 전체 글
          </Link>
          <h1 className="hand-title">
            Series
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {seriesEntries.length}개의 시리즈
          </p>
        </div>
        <SeriesView seriesEntries={seriesEntries} />
      </main>
    </>
  )
}
