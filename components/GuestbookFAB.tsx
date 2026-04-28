'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiEdit2, FiX } from 'react-icons/fi'

export default function GuestbookFAB() {
  const [showBubble, setShowBubble] = useState(true)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '1.5rem',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.0rem',
      }}
    >
      {/* 말풍선 */}
        <div
          style={{
            position: 'relative',
            visibility: showBubble ? 'visible' : 'hidden',
            background: '#3b82f6',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 400,
            padding: '0.45rem 1.75rem 0.45rem 0.85rem',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
            animation: 'fabFloat 2.4s ease-in-out infinite',
            boxShadow: '0 2px 12px rgba(59,130,246,0.3)',
          }}
        >
          방명록을 남겨주세요
          {/* 말풍선 꼬리 */}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #3b82f6',
          }} />
          <button
            onClick={() => setShowBubble(false)}
            aria-label="닫기"
            style={{
              position: 'absolute',
              top: '50%',
              right: '0.5rem',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.25)',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <FiX size={10} />
          </button>
        </div>

      <Link
        href="/guestbook"
        style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}
      >
        <button
          aria-label="방명록 쓰기"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(59,130,246,0.28)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.transform = 'translateY(-2px)'
            btn.style.boxShadow = '0 8px 24px rgba(59,130,246,0.4)'
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.transform = 'translateY(0)'
            btn.style.boxShadow = '0 4px 16px rgba(59,130,246,0.28)'
          }}
        >
          <FiEdit2 size={20} />
        </button>
      </Link>
    </div>
  )
}
