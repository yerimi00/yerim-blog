'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { IoIosArrowForward } from 'react-icons/io'

export default function MobileBlockModal() {
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isMobile) return null
  if (pathname === '/guestbook') return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '36px 28px',
        textAlign: 'center',
        maxWidth: '320px',
        width: '100%',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖥️</div>
        <p style={{
          color: 'var(--text)',
          fontSize: '17px',
          fontWeight: 600,
          lineHeight: 1.6,
          margin: 0,
        }}>
          개발 중인 기능이에요. 🥺
          <br />
          PC 화면으로 확인해주세요!
        </p>
        <Link
          href="/guestbook"
          style={{
            display: 'block',
            marginTop: '20px',
            padding: '0.7rem 1.25rem',
            borderRadius: '10px',
            background: '#3b82f6',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 600,
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          방명록 남기러 가기 <IoIosArrowForward />
        </Link>
      </div>
    </div>
  )
}
