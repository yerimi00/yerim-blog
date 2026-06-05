import Link from 'next/link'

const LINKS = [
  { label: '공지사항', href: '/notices', external: false },
  { label: '개발자에게', href: '/guestbook', external: false },
  { label: 'GitHub', href: 'https://github.com/yerimi00', external: true },
  { label: 'Velog', href: 'https://velog.io/@yerimi00', external: true },
]

export default function MobileFooterLinks() {
  const year = new Date().getFullYear()

  return (
    <div className="mobile-footer-links">
      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1.5rem' }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem 1rem',
        marginBottom: '1.25rem',
      }}>
        {LINKS.map(({ label, href, external }) =>
          external ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              {label}
            </a>
          ) : (
            <Link
              key={label}
              href={href}
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              {label}
            </Link>
          )
        )}
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
        © {year} yerimi00.log
      </p>
    </div>
  )
}
