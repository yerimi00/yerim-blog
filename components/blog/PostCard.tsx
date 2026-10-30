'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import { HiOutlineChatBubbleLeft } from 'react-icons/hi2'
import { motion } from 'motion/react'
import { fastTween } from '@/components/motion/presets'

const titleVariants = {
  rest: { color: 'var(--text)' },
  hover: { color: 'var(--accent)' },
}

export default function PostCard({ post, commentCount = 0 }: { post: Post; index?: number; commentCount?: number }) {
  const router = useRouter()

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      style={{
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
      }}
      onClick={() => router.push(`/blog/${post.slug}`)}
    >
      {/* 시리즈 + 태그 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
        {post.series && (
          <Link
            href={`/blog/series/${encodeURIComponent(post.series)}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: '0.73rem',
              fontWeight: 500,
              color: 'var(--accent)',
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              padding: '2px 10px',
              borderRadius: '20px',
              textDecoration: 'none',
            }}
          >
            {post.series}
          </Link>
        )}
        {post.tags.slice(0, 3).map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${encodeURIComponent(tag)}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
            }}
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* 제목 */}
      <motion.h3
        className="post-card-title"
        variants={titleVariants}
        transition={fastTween}
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '0.4rem',
          lineHeight: 1.45,
        }}
      >
        {post.title}
      </motion.h3>

      {/* 설명 */}
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          lineHeight: 1.65,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '0.6rem',
        }}
      >
        {post.description}
      </p>

      {/* 날짜 + 댓글 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {formatDate(post.date)}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <HiOutlineChatBubbleLeft style={{ fontSize: '0.95rem' }} />
          {commentCount}
        </span>
      </div>
    </motion.article>
  )
}
