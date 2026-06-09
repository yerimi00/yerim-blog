'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'

export default function HeroBanner({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const dragStartX = useRef<number | null>(null)
  const isDragging = useRef(false)
  const n = posts.length

  const prevIndex = (current - 1 + n) % n
  const nextIndex = (current + 1) % n

  useEffect(() => {
    if (n <= 1) return
    const t = setTimeout(() => setCurrent((c) => (c + 1) % n), 4000)
    return () => clearTimeout(t)
  }, [current, n])

  const onDragStart = (x: number) => {
    dragStartX.current = x
    isDragging.current = false
  }

  const onDragMove = (x: number) => {
    if (dragStartX.current === null) return
    const delta = x - dragStartX.current
    if (Math.abs(delta) > 5) isDragging.current = true
    setDragOffset(delta)
  }

  const onDragEnd = (x: number) => {
    if (dragStartX.current === null) return
    const delta = x - dragStartX.current
    dragStartX.current = null
    setDragOffset(0)
    if (n > 1 && Math.abs(delta) > 50) {
      setCurrent(delta < 0 ? nextIndex : prevIndex)
    }
  }

  if (!posts.length) return null

  const tx = (base: string) =>
    dragOffset ? `translateX(calc(${base} + ${dragOffset}px))` : `translateX(${base})`

  const slideBase: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'var(--bg-secondary)',
    overflow: 'hidden',
  }

  const renderSlide = (post: Post) => (
    <>
      {post.coverImage && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover', opacity: 0.15 }} />
        </div>
      )}
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
        draggable={false}
        onClick={(e) => { if (isDragging.current) e.preventDefault() }}
      >
        <div
          className="hero-banner-content"
          style={{ position: 'relative', zIndex: 1, height: '100%', padding: '2.5rem 3rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        >
          <div className="hero-banner-tags" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {post.series && (
              <span style={{ fontSize: '0.73rem', fontWeight: 500, color: 'var(--accent)', background: 'rgba(59,130,246,0.1)', padding: '2px 10px', borderRadius: '20px' }}>
                {post.series}
              </span>
            )}
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>#{tag}</span>
            ))}
          </div>
          <h2 className="hero-banner-title" style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', margin: '0.5rem 0', lineHeight: 1.4 }}>
            {post.title}
          </h2>
          <p className="hero-banner-description" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.description}
          </p>
        </div>
        <span className="hero-banner-date" style={{ position: 'absolute', bottom: '2rem', left: '3rem', zIndex: 1, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {formatDate(post.date)}{post.views !== undefined && ` · 조회 ${post.views}`}
        </span>
      </Link>
    </>
  )

  return (
    <div
      className="hero-banner"
      style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-secondary)', height: '280px', cursor: dragStartX.current !== null ? 'grabbing' : 'grab', touchAction: 'pan-y', userSelect: 'none' }}
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMove={(e) => { if (dragStartX.current !== null) onDragMove(e.clientX) }}
      onMouseUp={(e) => onDragEnd(e.clientX)}
      onMouseLeave={(e) => { if (dragStartX.current !== null) onDragEnd(e.clientX) }}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
      onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
    >
      {n > 1 && (
        <div style={{ ...slideBase, transform: tx('-100%') }}>
          {renderSlide(posts[prevIndex])}
        </div>
      )}
      <div style={{ ...slideBase, transform: tx('0%') }}>
        {renderSlide(posts[current])}
      </div>
      {n > 1 && (
        <div style={{ ...slideBase, transform: tx('100%') }}>
          {renderSlide(posts[nextIndex])}
        </div>
      )}

      {/* 인디케이터 */}
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '2rem', display: 'flex', gap: '6px', zIndex: 10 }}>
        {posts.map((_, i) => (
          <button
            key={i}
            onClick={() => { if (i !== current) setCurrent(i) }}
            style={{ width: i === current ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === current ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.2s, background 0.2s' }}
          />
        ))}
      </div>
    </div>
  )
}
