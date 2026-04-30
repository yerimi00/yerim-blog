import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GuestbookMessages from '@/components/GuestbookMessages'
import { getGuestbookEntries } from '@/lib/guestbook'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '방명록',
  description: '방명록',
}

export default async function GuestbookPage() {
  let entries: Awaited<ReturnType<typeof getGuestbookEntries>> = []

  try {
    entries = await getGuestbookEntries()
  } catch {
    // DB가 설정되지 않은 경우 빈 목록으로 fallback
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: 'Pretendard, sans-serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.5rem',
            }}
          >
            방명록
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            자유롭게 메시지를 남겨주세요.
          </p>
        </div>

        {/* 공지 배너 */}
        <div style={{
          marginBottom: '2rem',
          padding: '0.875rem 1rem',
          borderRadius: '10px',
          background: 'rgba(59, 130, 246, 0.03)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#3b82f6' }}>
            📢  업데이트 안내 (2026. 04. 30)
          </p>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            비공개 방명록 댓글에 비밀번호 기능을 추가했습니다.<br />
            <strong style={{ color: 'var(--text)', fontWeight: 500 }}>2026년 4월 30일 이전</strong>에 작성된 비공개 방명록의 비밀번호는{' '}
            <code style={{ fontSize: '0.8rem', background: 'var(--bg-secondary)', padding: '1px 5px', borderRadius: '4px' }}>0000</code>
            으로 초기화됩니다.
          </p>
        </div>

        <GuestbookMessages initialEntries={entries} />
      </main>
      <Footer />
    </>
  )
}
