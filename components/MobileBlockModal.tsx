'use client'

import { useEffect, useState } from 'react'

export default function MobileBlockModal() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isMobile) return null

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
      </div>
    </div>
  )
}
