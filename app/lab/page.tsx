export const metadata = {
  title: 'Lab',
  description: '준비 중인 기능이에요',
  robots: { index: false },
}

export default function LabPage() {
  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 className="page-title">Lab</h1>
      <div style={{ textAlign: 'center', padding: 'clamp(4rem, 12vw, 7rem) 0' }}>
        <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.4rem' }}>준비 중인 기능이에요</p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>더 다듬어서 열어둘게요.</p>
      </div>
    </main>
  )
}
