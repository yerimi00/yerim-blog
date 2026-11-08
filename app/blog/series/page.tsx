import { getPostsBySeries } from '@/lib/notion'
import SeriesView from '@/components/blog/SeriesView'
import BlogViewSwitch from '@/components/blog/BlogViewSwitch'

export const revalidate = 86400
export const metadata = { title: 'Series', description: '시리즈별로 묶인 글 모음', alternates: { canonical: '/blog/series' } }

export default async function SeriesPage() {
  const seriesMap = await getPostsBySeries()
  // 인터랙션 모음은 /lab으로 승격
  const seriesEntries = Object.entries(seriesMap).filter(([name]) => name !== 'interactions')

  return (
    <>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="page-title">
              Series
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {seriesEntries.length}개의 시리즈
            </p>
          </div>
          <BlogViewSwitch active="series" />
        </div>
        <SeriesView seriesEntries={seriesEntries} />
      </main>
    </>
  )
}
