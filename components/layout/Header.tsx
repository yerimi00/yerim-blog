'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import SearchModal from '@/components/blog/SearchModal'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/series', label: 'Series' },
  { href: '/project', label: 'Project' },
  { href: '/about', label: 'About' },
]

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              fontFamily: "Pretendard, sans-serif",
              fontWeight: 700,
              fontSize: '1.2rem',
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}
          >
            yerim.dev
          </span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span className="header-nav-links" style={{ display: 'contents' }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link">
                {label}
              </Link>
            ))}
          </span>

          {/* 검색 버튼 */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="header-search-btn"
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
              className="header-theme-btn"
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

        {/* 모바일 전용: 검색 + 햄버거 */}
        <div className="mobile-header-actions" style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setIsSearchOpen(true)}
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
            }}
            aria-label="검색"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="메뉴"
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
              flexDirection: 'column',
              gap: '5px',
              padding: '0',
            }}
          >
            <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'var(--text)', borderRadius: '2px', transition: 'transform 0.2s, opacity 0.2s', transform: isMenuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'var(--text)', borderRadius: '2px', transition: 'opacity 0.2s', opacity: isMenuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '16px', height: '1.5px', background: 'var(--text)', borderRadius: '2px', transition: 'transform 0.2s, opacity 0.2s', transform: isMenuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: 'absolute',
            top: '60px',
            left: 0,
            right: 0,
            background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 1.5rem 1.25rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Menu</span>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                }}
                aria-label="테마 전환"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            )}
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
