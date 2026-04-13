'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import { HiChevronDown } from 'react-icons/hi'

export default function SeriesList({ seriesEntries }: { seriesEntries: [string, Post[]][] }) {
  const [openSeries, setOpenSeries] = useState<Set<string>>(new Set())

  const toggle = (name: string) => {
    setOpenSeries((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  if (seriesEntries.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 0' }}>
        아직 시리즈가 없어요.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {seriesEntries.map(([seriesName, posts]) => {
        const isOpen = openSeries.has(seriesName)
        return (
          <div
            key={seriesName}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
            }}
          >
            {/* 시리즈 헤더 (토글 버튼) */}
            <button
              onClick={() => toggle(seriesName)}
              style={{
                width: '100%',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                borderBottom: isOpen ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  {seriesName}
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '1px 9px',
                }}>
                  {posts.length}편
                </span>
              </div>
              <HiChevronDown
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1.5rem',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                }}
              />
            </button>

            {/* 글 목록 */}
            {isOpen && (
              <div>
                {posts.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div style={{
                      padding: '1.1rem 1.5rem',
                      borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem', lineHeight: 1.45 }}>
                        {post.title}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.35rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.description}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatDate(post.date)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
