'use client'

import { useRouter } from 'next/navigation'
import { IoIosArrowForward } from 'react-icons/io'

export default function AboutSidebarCard() {
  const router = useRouter()

  return (
    <div
      className="sidebar-card card-hover"
      style={{ cursor: 'pointer' }}
      onClick={() => router.push('/about')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/profile.jpg"
          alt="프로필 사진"
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.1rem' }}>yerim</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>개발을 배우고, 배운 것을 기록합니다</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
        {[
          { label: 'GitHub', href: 'https://github.com/yerimi00' },
          { label: 'Velog', href: 'https://velog.io/@yerimi00' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            {label} <IoIosArrowForward />
          </a>
        ))}
      </div>
    </div>
  )
}
