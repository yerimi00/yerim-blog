'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'

export default function HeroBanner({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (posts.length <= 1) return
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % posts.length)
        setAnimating(false)
      }, 300)
    }, 4000)
    return () => clearInterval(timer)
  }, [posts.length])

  if (!posts.length) return null

  const post = posts[current]

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        height: '280px',
        cursor: 'pointer',
      }}
    >
      {/* 배경 이미지 */}
      {post.coverImage && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            style={{ objectFit: 'cover', opacity: 0.15 }}
          />
        </div>
      )}

      {/* 콘텐츠 */}
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            padding: '2.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.3s, transform 0.3s',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>
          <h2
            style={{
              fontFamily: "Pretendard, sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.5rem',
              lineHeight: 1.4,
            }}
          >
            {post.title}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {post.description}
          </p>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {formatDate(post.date)}
            {post.views !== undefined && ` · 조회 ${post.views}`}
          </span>
        </div>
      </Link>

      {/* 인디케이터 */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '2rem',
          display: 'flex',
          gap: '6px',
          zIndex: 2,
        }}
      >
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === current ? 'var(--accent)' : 'var(--border)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
