import Link from 'next/link'

export const metadata = {
  title: 'Lab',
  description: '직접 만들어 본 도구와 실험 모음',
  alternates: { canonical: '/lab' },
}

const TOOLS = [
  { href: '/lab/card-news', name: '카드뉴스 만들기', note: '디자인 19종 · PNG', color: 'var(--lab-folder)' },
  { href: '/lab/meme', name: '짤 추천', note: '상황·감정 → 짤', color: 'var(--lab-folder-meme)' },
]

export default function LabPage() {
  return (
    <>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="page-title">
            Lab
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            직접 만들어 본 도구와 실험을 모아요.
          </p>
        </div>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>도구</h2>
          <div className="series-folder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
              >
                {/* 회색 폴더 이미지 위에 같은 모양으로 도구 색을 color 블렌드로 입힌다 — 밝기·명암은 그대로, 색만 바뀌어 파스텔이 된다 */}
                <span style={{ position: 'relative', display: 'block', width: '96px', aspectRatio: '874 / 736' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/folder.png" alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: tool.color,
                      mixBlendMode: 'color',
                      WebkitMask: 'url(/folder.png) center / contain no-repeat',
                      mask: 'url(/folder.png) center / contain no-repeat',
                    }}
                  />
                </span>
                <span style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{tool.name}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{tool.note}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}
