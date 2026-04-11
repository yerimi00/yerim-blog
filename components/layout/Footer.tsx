import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        marginTop: '4rem',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          © 2025 yerim.dev · 배우고 기록하는 중
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { href: 'https://github.com/your-github', label: 'GitHub' },
            { href: 'https://velog.io/@your-velog', label: 'Velog' },
          ].map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
