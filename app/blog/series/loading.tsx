import Skeleton from '@/components/motion/Skeleton'

function SeriesGridItemSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
      <Skeleton style={{ width: '96px', height: '80px', borderRadius: '8px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <Skeleton style={{ width: '72px', height: '0.85rem' }} />
        <Skeleton style={{ width: '28px', height: '0.75rem' }} />
      </div>
    </div>
  )
}

export default function SeriesLoading() {
  return (
    <>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <Skeleton style={{ width: '96px', height: '2rem', marginBottom: '0.5rem' }} />
          <Skeleton style={{ width: '88px', height: '0.9rem' }} />
        </div>

        {/* 뷰 토글 버튼 자리 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginBottom: '1.25rem' }}>
          <Skeleton style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
          <Skeleton style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SeriesGridItemSkeleton key={i} />
          ))}
        </div>
      </main>
    </>
  )
}
