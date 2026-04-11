import Link from 'next/link'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'

export default function Sidebar({ popularPosts }: { popularPosts: Post[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 인기 있는 글 */}
      <div className="sidebar-card">
        <h3
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          인기 있는 글
        </h3>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {popularPosts.map((post, i) => (
            <li key={post.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: '1.6',
                  minWidth: '16px',
                }}
              >
                {i + 1}
              </span>
              <Link
                href={`/blog/${post.slug}`}
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* 최신 댓글 (giscus는 iframe이라 최신댓글 목록은 별도 표시) */}
      <div className="sidebar-card">
        <h3
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          최신 댓글
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          댓글은 각 글 하단의 giscus를 통해 확인할 수 있어요.
        </p>
        <a
          href="https://github.com/your-repo/discussions"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            fontSize: '0.8rem',
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          GitHub Discussions 바로가기 →
        </a>
      </div>

      {/* 태그 클라우드 공간 (추후 확장) */}
      <div className="sidebar-card">
        <h3
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          시리즈
        </h3>
        <Link
          href="/series"
          style={{
            fontSize: '0.85rem',
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          전체 시리즈 보기 →
        </Link>
      </div>
    </div>
  )
}
