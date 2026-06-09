import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CardStackDemo from '@/components/blog/CardStackDemo'
import ColorCardStackDemo from '@/components/blog/ColorCardStackDemo'
import HorizontalCardSwipeDemo from '@/components/blog/HorizontalCardSwipeDemo'
import CenteredCardSwipeDemo from '@/components/blog/CenteredCardSwipeDemo'
import WalletCardDemo from '@/components/blog/WalletCardDemo'
import WalletCardDemo2 from '@/components/blog/WalletCardDemo2'

export const revalidate = 86400

const INTERACTION_SERIES = 'interactions'
const INTERACTION_SERIES_LABEL = '인터랙션 모음'

const DEMOS: Record<string, { title: string; description: string }> = {
  'card-stack-ui': {
    title: '카드 스택 UI',
    description: '드래그 또는 스크롤로 카드를 넘기는 수직 스택 인터랙션',
  },
  'color-card-stack': {
    title: '컬러 카드 스택',
    description: '3가지 색상 카드로 구현한 수직 스택 인터랙션',
  },
  'horizontal-card-swipe': {
    title: '좌우 카드 스와이프',
    description: '드래그로 카드를 좌우로 전환하는 수평 스와이프 인터랙션',
  },
  'centered-card-swipe': {
    title: '양옆 카드 스와이프',
    description: '현재 카드를 중앙에 두고 양옆 카드가 살짝 보이는 캐러셀 인터랙션',
  },
  'wallet-card': {
    title: '지갑 카드 스택',
    description: '카드를 위로 드래그해 지갑에서 꺼내는 겹침 스택 인터랙션',
  },
  'wallet-card-2': {
    title: '지갑 카드 스택 2',
    description: '호버·클릭으로 카드가 위로 펼쳐지는 지갑 스택 인터랙션',
  },
}

export async function generateStaticParams() {
  return Object.keys(DEMOS).map(slug => ({
    seriesName: INTERACTION_SERIES,
    subFolder: slug,
  }))
}

export async function generateMetadata({ params }: { params: { subFolder: string } }) {
  const slug = params.subFolder
  const demo = DEMOS[slug]
  return {
    title: `${demo?.title ?? slug} — ${INTERACTION_SERIES_LABEL}`,
    description: demo?.description ?? slug,
  }
}

export default function SubFolderPage({ params }: { params: { seriesName: string; subFolder: string } }) {
  const seriesName = params.seriesName
  const subFolder = params.subFolder

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
        {subFolder === 'color-card-stack' ? <ColorCardStackDemo />
          : subFolder === 'horizontal-card-swipe' ? <HorizontalCardSwipeDemo />
          : subFolder === 'centered-card-swipe' ? <CenteredCardSwipeDemo />
          : subFolder === 'wallet-card' ? <WalletCardDemo />
          : subFolder === 'wallet-card-2' ? <WalletCardDemo2 />
          : <CardStackDemo />}

      </main>
      <Footer />
    </>
  )
}
