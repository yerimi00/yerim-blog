'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HiOutlineHome, HiHome,
  HiOutlineDocumentText, HiDocumentText,
  HiOutlineFolder, HiFolder,
  HiOutlineBriefcase, HiBriefcase,
  HiOutlineUser, HiUser,
} from 'react-icons/hi2'

const NAV_ITEMS = [
  { href: '/',        label: 'Home',    Icon: HiOutlineHome,         ActiveIcon: HiHome },
  { href: '/blog',    label: 'Blog',    Icon: HiOutlineDocumentText, ActiveIcon: HiDocumentText },
  { href: '/series',  label: 'Series',  Icon: HiOutlineFolder,       ActiveIcon: HiFolder },
  { href: '/project', label: 'Project', Icon: HiOutlineBriefcase,    ActiveIcon: HiBriefcase },
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
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              textDecoration: 'none',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              paddingTop: '8px',
              paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
              transition: 'color 0.15s',
            }}
          >
            {active
              ? <ActiveIcon style={{ fontSize: '1.35rem' }} />
              : <Icon style={{ fontSize: '1.35rem' }} />
            }
            <span style={{ fontSize: '0.62rem', fontWeight: active ? 600 : 400, lineHeight: 1 }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
