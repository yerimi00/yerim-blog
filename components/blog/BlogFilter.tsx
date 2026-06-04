'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Post } from '@/types'
import PostCard from './PostCard'

export default function BlogFilter({
  series,
  posts,
  commentCounts = {},
}: {
  series: string[]
  posts: Post[]
  commentCounts?: Record<string, number>
}) {
  const pathname = usePathname()
  const isAllActive = pathname === '/' || pathname === '/blog'

  return (
    <div>
      {/* 시리즈 탭 — URL 기반 네비게이션 */}
      <div className="series-tab-bar">
        <Link
          href="/blog"
          className={`series-tab-btn${isAllActive ? ' active' : ''}`}
        >
          전체
        </Link>
        {series.map((tab) => {
          const isActive = pathname === `/series/${encodeURIComponent(tab)}`
          return (
            <Link
              key={tab}
              href={`/series/${encodeURIComponent(tab)}`}
              className={`series-tab-btn${isActive ? ' active' : ''}`}
            >
              {tab}
            </Link>
          )
        })}
      </div>

      {/* 글 목록 */}
      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
          글이 없어요.
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} commentCount={commentCounts[post.slug] ?? 0} />
          ))}
        </div>
      )}
    </div>
  )
}
