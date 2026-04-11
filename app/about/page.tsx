import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'About', description: '안녕하세요, 예림입니다' }

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {/* 프로필 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            예
          </div>
          <div>
            <h1
              style={{
                fontFamily: 'Noto Serif KR, serif',
                fontSize: '1.7rem',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '0.4rem',
              }}
            >
              안녕하세요, 예림입니다 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              개발을 배우고, 배운 것을 기록합니다
            </p>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />

        {/* 소개 내용 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              About
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.8 }}>
              현재 휴학 중으로 유리프트에서 실무를 경험하고 있어요. 개발, 기획, 운영을 넘나들며 배운 것들을 이 블로그에 솔직하게 기록하고 있습니다. 완벽하지 않아도, 배우는 중이라는 것 자체가 의미 있다고 생각해요.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              관심사
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['백엔드 개발', 'Spring Boot', 'React', 'CS 공부', '기획', '교육'].map((item) => (
                <span key={item} className="tag-badge" style={{ fontSize: '0.85rem', padding: '5px 12px' }}>
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              링크
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'GitHub', url: 'https://github.com/your-github' },
                { label: 'Velog', url: 'https://velog.io/@your-velog' },
              ].map(({ label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {label} →
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
