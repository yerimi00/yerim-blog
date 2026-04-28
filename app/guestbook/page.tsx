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

        <GuestbookMessages initialEntries={entries} />
      </main>
      <Footer />
    </>
  )
}
