import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
      <h2 style={{
        fontSize: '0.82rem',
        fontWeight: 600,
        color: 'var(--text-muted)',
        marginBottom: '1.25rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        관련 포스트
      </h2>
      <div className="related-posts-grid">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div
              className="related-post-card"
              style={{
                borderRadius: '8px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                background: 'var(--surface)',
                transition: 'border-color 0.15s, transform 0.15s',
              }}
            >
              {post.coverImage ? (
                <div style={{ position: 'relative', height: '110px', background: 'var(--bg-secondary)' }}>
                  <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{
                  height: '70px',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 1rem',
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {post.series ?? post.tags[0] ?? ''}
                  </span>
                </div>
              )}
              <div style={{ padding: '0.75rem' }}>
                <p style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  lineHeight: 1.4,
                  margin: '0 0 0.35rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {post.title}
                </p>
                <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                  {formatDate(post.date)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
