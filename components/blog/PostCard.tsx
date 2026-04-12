import Link from 'next/link'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'

export default function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article
        className="card-hover"
        style={{
          padding: '1.5rem 0.75rem',
          margin: '0 -0.75rem',
          borderRadius: '8px',
          borderBottom: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: post.coverImage ? 'auto 1fr auto' : '1fr auto',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* 커버 이미지 */}
        {post.coverImage && (
          <div style={{ width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={post.coverImage}
              alt=""
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div>
          {/* 시리즈 + 태그 */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {post.series && (
              <>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {post.series}
                </span>
                <span style={{ color: 'var(--border)', fontSize: '0.7rem' }}>·</span>
              </>
            )}
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>

          {/* 제목 */}
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.4rem',
              lineHeight: 1.4,
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
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.description}
          </p>

          {/* 날짜 + 읽기 시간 + 조회수 */}
          <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {formatDate(post.date)}
            {` · ${Math.max(1, Math.ceil(post.description.length / 30))}분 읽기`}
            {post.views !== undefined && ` · 조회 ${post.views}`}
          </div>
        </div>

        {/* 번호 */}
        <span
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--border)',
            lineHeight: 1,
            paddingTop: '4px',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </article>
    </Link>
  )
}
