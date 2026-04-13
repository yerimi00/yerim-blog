import { getPostsBySeries } from '@/lib/notion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SeriesList from '@/components/blog/SeriesList'

export const revalidate = 60
export const metadata = { title: 'Series', description: '시리즈별로 묶인 글 모음' }

export default async function SeriesPage() {
  const seriesMap = await getPostsBySeries()
  const seriesEntries = Object.entries(seriesMap)

  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Series
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {seriesEntries.length}개의 시리즈
          </p>
        </div>
        <SeriesList seriesEntries={seriesEntries} />
      </main>
      <Footer />
    </>
  )
}
