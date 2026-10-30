'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FiEdit2, FiX } from 'react-icons/fi'
import { motion } from 'motion/react'
import { fastTween } from '@/components/motion/presets'

export default function GuestbookFAB() {
  const [showBubble, setShowBubble] = useState(true)
  const pathname = usePathname()

  if (pathname === '/guestbook') return null

  const isHome = pathname === '/'

  return (
    <div
      className={`guestbook-fab${isHome ? ' guestbook-fab--home' : ''}`}
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
      {/* 말풍선: --float(0→1→0)를 JS로 돌리고, 방향(세로/모바일 홈은 가로)은 CSS가 정한다 */}
        <motion.div
          className="fab-bubble"
          initial={false}
          // transform은 CSS가 --float로 계산하므로 여기선 opacity만 (motion이 transform을 쓰면 덮어씀)
          animate={{ '--float': [0, 1, 0], opacity: showBubble ? 1 : 0 }}
          transition={{
            '--float': { duration: 2.4, ease: 'easeInOut', repeat: Infinity },
            opacity: fastTween,
          }}
          style={{
            position: 'relative',
            pointerEvents: showBubble ? 'auto' : 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 400,
            padding: '0.45rem 1.75rem 0.45rem 0.85rem',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
            boxShadow: '0 2px 12px color-mix(in srgb, var(--accent) 30%, transparent)',
          }}
        >
          방명록을 남겨주세요
          {/* 말풍선 꼬리 */}
          <div className="fab-bubble-tail" style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--accent)',
          }} />
          <button
            className="fab-close-btn"
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
        </motion.div>

      <Link
        href="/guestbook"
        aria-label="방명록 쓰기"
        style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}
      >
        <motion.span
          whileHover={{ y: -2, boxShadow: '0 8px 24px color-mix(in srgb, var(--accent) 40%, transparent)' }}
          whileTap={{ scale: 0.94 }}
          transition={fastTween}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--accent) 28%, transparent)',
          }}
        >
          <FiEdit2 size={20} />
        </motion.span>
      </Link>
    </div>
  )
}
