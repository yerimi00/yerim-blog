import Link from 'next/link'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { Post } from '@/types'

interface Props {
  prev: Post | null
  next: Post | null
}

export default function PostNavigation({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <nav
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* 이전 글 */}
      <div>
        {prev && (
          <Link href={`/blog/${prev.slug}`} style={{ textDecoration: 'none' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><IoIosArrowBack /> 이전 글</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
              {prev.title}
            </p>
          </Link>
        )}
      </div>

      {/* 다음 글 */}
      <div style={{ textAlign: 'right' }}>
        {next && (
          <Link href={`/blog/${next.slug}`} style={{ textDecoration: 'none' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>다음 글 <IoIosArrowForward /></p>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
              {next.title}
            </p>
          </Link>
        )}
      </div>
    </nav>
  )
}
