'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import SearchModal from '@/components/blog/SearchModal'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  // Cmd+K / Ctrl+K 단축키
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 로고 */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: 'Noto Serif KR, serif',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}
          >
            yerim.dev
          </span>
        </Link>

        {/* 네비게이션 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {[
            { href: '/', label: 'Home' },
            { href: '/blog', label: 'Blog' },
            { href: '/series', label: 'Series' },
            { href: '/about', label: 'About' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--accent)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
            >
              {label}
            </Link>
          ))}

          {/* 검색 버튼 */}
          <button
            onClick={() => setIsSearchOpen(true)}
            style={{
              height: '36px',
              padding: '0 10px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.15s',
            }}
            aria-label="검색"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <kbd style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'inherit', lineHeight: 1 }}>
              ⌘K
            </kbd>
          </button>

          {/* 다크모드 토글 */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                transition: 'background 0.15s',
              }}
              aria-label="테마 전환"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}
        </nav>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
