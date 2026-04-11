'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // 모달 열릴 때 포스트 데이터 fetch
  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch('/api/search')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
  }, [isOpen])

  // 열릴 때 input 포커스 + 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setActiveIndex(0)
    }
  }, [isOpen])

  // 키보드 이동 시 활성 항목 자동 스크롤
  useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector('[data-active="true"]')
    activeEl?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  // ESC 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const filtered = query.trim()
    ? posts.filter((p) => {
        const q = query.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
    : []

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      window.location.href = `/blog/${filtered[activeIndex].slug}`
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0 1.5rem',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        }}
      >
        {/* 입력창 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            gap: '0.75rem',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="제목, 내용, 태그 검색..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text)',
            }}
          />
          <kbd
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontFamily: 'inherit',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* 결과 목록 — 쿼리 있을 때만 */}
        {query.trim() && (
          <div ref={listRef} style={{ maxHeight: '55vh', overflowY: 'auto' }}>
            {loading ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                검색 중...
              </p>
            ) : filtered.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                검색 결과가 없어요.
              </p>
            ) : (
              filtered.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  onClick={onClose}
                  data-active={i === activeIndex}
                  style={{
                    display: 'block',
                    padding: '1rem 1.25rem',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--border)',
                    background: i === activeIndex ? 'var(--bg-secondary)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag-badge">{tag}</span>
                    ))}
                  </div>
                  <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                    {post.title}
                  </p>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {post.description}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(post.date)}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}

        {/* 하단 단축키 힌트 — 쿼리 있을 때만 */}
        {query.trim() && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            display: 'flex',
            gap: '1rem',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
          }}
        >
          {[['↑↓', '이동'], ['↵', '열기'], ['ESC', '닫기']].map(([key, label]) => (
            <span
              key={key}
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <kbd
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '1px 5px',
                  fontSize: '0.7rem',
                  fontFamily: 'inherit',
                }}
              >
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}
