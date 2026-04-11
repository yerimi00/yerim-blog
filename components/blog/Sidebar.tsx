import Link from 'next/link'
import { Post } from '@/types'

interface Props {
  popularPosts: Post[]
  totalPosts: number
  totalViews: number
  seriesCount: number
}

export default function Sidebar({ popularPosts, totalPosts, totalViews, seriesCount }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 통계 */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        글 <strong style={{ color: 'var(--text)' }}>{totalPosts}</strong>
        {' · '}조회수 <strong style={{ color: 'var(--text)' }}>{totalViews.toLocaleString()}</strong>
        {' · '}시리즈 <strong style={{ color: 'var(--text)' }}>{seriesCount}</strong>
      </p>

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

      {/* About 미니 카드 */}
      <div className="sidebar-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            예
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.1rem' }}>yerim</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>개발을 배우고, 배운 것을 기록합니다</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { label: 'GitHub', href: 'https://github.com/yerimi00' },
            { label: 'Velog', href: 'https://velog.io/@yerimi00' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}
            >
              {label} →
            </a>
          ))}
        </div>
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
