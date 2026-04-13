import Link from 'next/link'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import { HiOutlineChatBubbleLeft } from 'react-icons/hi2'

export default function PostCard({ post, commentCount = 0 }: { post: Post; index?: number; commentCount?: number }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          padding: '1.5rem 0',
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          const title = (e.currentTarget as HTMLElement).querySelector('.post-title') as HTMLElement
          if (title) title.style.color = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          const title = (e.currentTarget as HTMLElement).querySelector('.post-title') as HTMLElement
          if (title) title.style.color = 'var(--text)'
        }}
      >
        {/* 시리즈 + 태그 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
          {/* 시리즈: 파란 배지 */}
          {post.series && (
            <span
              style={{
                fontSize: '0.73rem',
                fontWeight: 500,
                color: 'var(--accent)',
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '2px 10px',
                borderRadius: '20px',
              }}
            >
              {post.series}
            </span>
          )}
          {/* 태그: # 접두사 텍스트 */}
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 제목 */}
        <h3
          className="post-title"
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '0.4rem',
            lineHeight: 1.45,
            transition: 'color 0.15s',
          }}
        >
          {post.title}
        </h3>

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
      </article>
    </Link>
  )
}
