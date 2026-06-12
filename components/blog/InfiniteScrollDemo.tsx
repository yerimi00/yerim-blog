'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CATEGORIES = ['카페', '음식점', '쇼핑', '전시'] as const
type Category = typeof CATEGORIES[number]

const CAFE_DATA = ['블루보틀 성수', '프릳츠 도화', '어니언 미아', '테라로사 경복궁', '나무사이로 서교', '커피리브레 연남', '센터커피 한남', '브루어스 이태원', '커피한약방 익선', '스페셜티 합정']
const FOOD_DATA = ['이태원 모노끼', '을지로 감자국', '삼청 파스타', '홍대 타코', '청담 스시', '합정 피자', '성수 브런치', '연남 라멘', '마포 냉면', '한남 비스트로']

function generateItems(category: Category, page: number) {
  const base = category === '카페' || category === '전시' ? CAFE_DATA : FOOD_DATA
  const priceBase = { '카페': 5, '음식점': 12, '쇼핑': 8, '전시': 2 }[category]
  return Array.from({ length: 5 }, (_, i) => {
    const idx = (page * 5 + i) % base.length
    return {
      id: page * 5 + i,
      name: base[idx] + (page > 0 ? ` ${page + 1}` : ''),
      price: `${priceBase + Math.floor(Math.random() * priceBase / 2)}만원~`,
      rating: (4 + Math.random()).toFixed(1),
      reviews: Math.floor(20 + Math.random() * 200),
    }
  })
}

export default function InfiniteScrollDemo() {
  const [category, setCategory] = useState<Category>('카페')
  const [items, setItems] = useState(() => generateItems('카페', 0))
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef(0)

  const loadMore = useCallback((cat: Category) => {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      const next = pageRef.current + 1
      pageRef.current = next
      setPage(next)
      setItems(prev => [...prev, ...generateItems(cat, next)])
      if (next >= 4) setHasMore(false)
      setLoading(false)
    }, 700)
  }, [loading])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore(category)
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loadMore, category])

  const switchCategory = (cat: Category) => {
    setCategory(cat)
    setItems(generateItems(cat, 0))
    setPage(0)
    pageRef.current = 0
    setHasMore(true)
  }

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => switchCategory(c)}
            style={{
              padding: '7px 14px', borderRadius: 100, flexShrink: 0,
              border: `1.5px solid ${category === c ? '#7c3aed' : 'var(--border, #e5e7eb)'}`,
              background: category === c ? '#ede9fe' : 'var(--surface, #fff)',
              color: category === c ? '#7c3aed' : 'var(--text, #374151)',
              fontSize: 13, fontWeight: category === c ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              background: 'var(--surface, #fff)',
              border: '1px solid var(--border, #e5e7eb)',
              borderRadius: 12,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}>
              {{'카페':'☕','음식점':'🍽️','쇼핑':'🛍️','전시':'🎨'}[category]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text, #111)', marginBottom: 2 }}>
                {item.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted, #9ca3af)' }}>
                {item.price} · ⭐ {item.rating} ({item.reviews}개)
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted, #9ca3af)', fontSize: 13 }}>
            불러오는 중...
          </div>
        )}
        {!hasMore && (
          <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted, #9ca3af)', fontSize: 12 }}>
            총 {items.length}개 결과
          </div>
        )}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  )
}
