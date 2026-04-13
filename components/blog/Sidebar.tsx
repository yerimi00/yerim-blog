import Link from 'next/link'
import { Post } from '@/types'

interface Props {
  popularPosts: Post[]
  totalPosts: number
  totalViews: number
  seriesCount: number
}

export default function Sidebar({ popularPosts }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* 인기 있는 글 */}
      <div className="sidebar-card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
          인기 있는 글
        </h3>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {popularPosts.map((post, i) => (
            <li key={post.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {i + 1}
              </span>
              <div>
                <Link
                  href={`/blog/${post.slug}`}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
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
                {post.tags[0] && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    {post.tags[0]}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 최신 댓글 */}
      <div className="sidebar-card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
          최신 댓글
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          아직 댓글이 없습니다.
        </p>
      </div>

      {/* About 카드 */}
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
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none' }}>
              {label} →
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
