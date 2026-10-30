import Skeleton from '@/components/motion/Skeleton'

function PostCardSkeleton() {
  return (
    <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
      {/* 시리즈 + 태그 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <Skeleton style={{ width: '72px', height: '1.3rem', borderRadius: '20px' }} />
        <Skeleton style={{ width: '52px', height: '1.3rem', borderRadius: '4px' }} />
      </div>
      {/* 제목 */}
      <Skeleton style={{ width: '70%', height: '1.1rem', marginBottom: '0.4rem' }} />
      {/* 설명 2줄 */}
      <Skeleton style={{ width: '95%', height: '0.875rem', marginBottom: '0.35rem' }} />
      <Skeleton style={{ width: '75%', height: '0.875rem', marginBottom: '0.6rem' }} />
      {/* 날짜 + 댓글 */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Skeleton style={{ width: '72px', height: '0.8rem' }} />
        <Skeleton style={{ width: '28px', height: '0.8rem' }} />
      </div>
    </div>
  )
}

export default function BlogLoading() {
  return (
    <>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <Skeleton style={{ width: '80px', height: '2rem', marginBottom: '0.5rem' }} />
          <Skeleton style={{ width: '72px', height: '0.9rem' }} />
        </div>

        {/* 탭 필터 — series-tab-bar 언더라인 스타일 */}
        <div className="series-tab-bar" style={{ marginBottom: '0' }}>
          {[40, 80, 68, 90, 56].map((w, i) => (
            <Skeleton
              key={i} style={{
                width: `${w}px`,
                height: '0.875rem',
                margin: '0.6rem 1rem 0.6rem 0',
              }}
            />
          ))}
        </div>

        {/* 포스트 카드 목록 */}
        {Array.from({ length: 7 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </main>
    </>
  )
}
