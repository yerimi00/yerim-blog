import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween } from '@/components/motion/presets'
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
          <MotionLink
            key={post.id}
            href={`/blog/${post.slug}`}
            className="related-post-card"
            whileHover={{ y: -2, borderColor: 'var(--outline-variant)' }}
            transition={fastTween}
            style={{
              textDecoration: 'none',
              display: 'block',
              borderRadius: '8px',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'var(--border)',
              overflow: 'hidden',
              background: 'var(--surface)',
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
          </MotionLink>
        ))}
      </div>
    </section>
  )
}
