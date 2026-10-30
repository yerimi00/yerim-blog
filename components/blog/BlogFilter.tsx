'use client'

import { useState } from 'react'
import TabButton from '@/components/motion/TabButton'
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
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = selected ? posts.filter((p) => p.series === selected) : posts
  const allTabs = ['전체', ...series]

  return (
    <div>
      <div className="series-tab-bar">
        {allTabs.map((tab) => {
          const isActive = tab === '전체' ? !selected : selected === tab
          return (
            <TabButton key={tab} active={isActive} onClick={() => setSelected(tab === '전체' ? null : tab === selected ? null : tab)}>
              {tab}
            </TabButton>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
          글이 없어요.
        </p>
      ) : (
        <div>
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} commentCount={commentCounts[post.slug] ?? 0} />
          ))}
        </div>
      )}
    </div>
  )
}
