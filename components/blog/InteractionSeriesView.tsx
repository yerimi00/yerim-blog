'use client'

import Link from 'next/link'

const SUB_FOLDERS = [
  { slug: 'card-stack-ui', label: '카드 스택 UI' },
  { slug: 'color-card-stack', label: '컬러 카드 스택' },
  { slug: 'horizontal-card-swipe', label: '좌우 카드 스와이프' },
  { slug: 'centered-card-swipe', label: '양옆 카드 스와이프' },
  { slug: 'wallet-card', label: '지갑 카드 스택' },
  { slug: 'wallet-card-2', label: '지갑 카드 스택 2' },
  { slug: 'micro-interaction', label: '마이크로 인터랙션' },
  { slug: 'physics-heart', label: '물리 하트 + 바텀시트' },
  { slug: 'onboarding-slider', label: '온보딩 슬라이더' },
  { slug: 'view-toggle', label: '뷰 토글' },
  { slug: 'price-range-slider', label: '가격 범위 슬라이더' },
  { slug: 'chip-filter', label: '칩 필터' },
  { slug: 'category-dimming', label: '카테고리 Dimming' },
  { slug: 'notification-sse', label: '실시간 알림 SSE' },
  { slug: 'signup-wizard', label: '회원가입 Wizard' },
  { slug: 'infinite-scroll', label: '무한 스크롤' },
  { slug: 'auto-save', label: '자동저장' },
  { slug: 'dress-fitting', label: '필터 선택 UI' },
  { slug: 'search-bar-badge', label: '검색바 + 알림 배지' },
  { slug: 'banner-carousel', label: '배너 캐러셀' },
  { slug: 'my-tabs', label: '마이페이지 탭' },
]

export default function InteractionSeriesView({ seriesName }: { seriesName: string }) {
  return (
    <div className="series-folder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem 0.5rem' }}>
      {SUB_FOLDERS.map(({ slug, label }) => (
        <Link
          key={slug}
          href={`/series/${seriesName}/${slug}`}
          style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/folder.png"
            alt={label}
            style={{ width: '96px', height: 'auto', transition: 'transform 0.15s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'translateY(-4px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'translateY(0)' }}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
              {label}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
