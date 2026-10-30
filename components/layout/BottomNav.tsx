'use client'

import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween } from '@/components/motion/presets'
import { usePathname } from 'next/navigation'
import {
  HiOutlineHome, HiHome,
  HiOutlineDocumentText, HiDocumentText,
  HiOutlineChatBubbleLeftRight, HiChatBubbleLeftRight,
  HiOutlineBriefcase, HiBriefcase,
  HiOutlineUser, HiUser,
} from 'react-icons/hi2'

const NAV_ITEMS = [
  { href: '/',        label: 'Home',    Icon: HiOutlineHome,         ActiveIcon: HiHome },
  { href: '/blog',    label: 'Blog',    Icon: HiOutlineDocumentText, ActiveIcon: HiDocumentText },
  { href: '/interview', label: 'Interview', Icon: HiOutlineChatBubbleLeftRight, ActiveIcon: HiChatBubbleLeftRight },
  { href: '/work',    label: 'Work',    Icon: HiOutlineBriefcase,    ActiveIcon: HiBriefcase },
  { href: '/about',   label: 'About',   Icon: HiOutlineUser,         ActiveIcon: HiUser },
]

export default function BottomNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ href, label, Icon, ActiveIcon }) => {
        const active = isActive(href)
        return (
          <MotionLink
            key={href}
            href={href}
            initial={false}
            animate={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
            transition={fastTween}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              textDecoration: 'none',
              paddingTop: '8px',
              paddingBottom: '8px',
            }}
          >
            {active
              ? <ActiveIcon style={{ fontSize: '1.35rem' }} />
              : <Icon style={{ fontSize: '1.35rem' }} />
            }
            <span style={{ fontSize: '0.62rem', fontWeight: active ? 600 : 400, lineHeight: 1 }}>
              {label}
            </span>
          </MotionLink>
        )
      })}
    </nav>
  )
}
