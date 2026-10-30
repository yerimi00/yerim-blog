import Link from 'next/link'
import { getAllPosts } from '@/lib/notion'
import { getAllProjects } from '@/lib/projects'
import { getPublishedQuestions } from '@/lib/interview'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TodayQuestionCard from '@/components/interview/TodayQuestionCard'
import { DEMOS } from '@/app/data/interactions/interactions-data'

export const revalidate = 3600

const LINKS = [
  { label: 'About', href: '/about' },
  { label: 'GitHub', href: 'https://github.com/yerimi00' },
  { label: 'Velog', href: 'https://velog.io/@yerimi00' },
]

const sectionTitle: React.CSSProperties = { fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: 0 }
const moreLink: React.CSSProperties = { fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }

// '2026-10-30' → '26.10'
function toYYMM(date: string) {
  return date ? `${date.slice(2, 4)}.${date.slice(5, 7)}` : ''
}

export default async function HomePage() {
  const [posts, projects, questions] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
    getPublishedQuestions(),
  ])
  const recentPosts = posts.slice(0, 5)
  const featured = projects.filter((p) => p.featured)
  const works = (featured.length ? featured : projects).slice(0, 3)
  const today = questions[0]

  return (
    <>
      <Header />
      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* 소개 */}
        <section style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
            이예림
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
            프론트엔드를 중심으로 백엔드와 기획 사이를 오가며 만들고, 배운 것을 기록해요.
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
            {LINKS.map(({ label, href }) =>
              href.startsWith('http') ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>{label}</a>
              ) : (
                <Link key={label} href={href} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{label}</Link>
              )
            )}
          </div>
        </section>

        {/* 오늘의 면접 질문 */}
        {today && (
          <section style={{ marginBottom: '3rem' }}>
            <TodayQuestionCard question={today} />
          </section>
        )}

        {/* 최근 글 */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
            <h2 style={sectionTitle}>최근 글</h2>
            <Link href="/blog" style={moreLink}>전체 {posts.length}개 보기 →</Link>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recentPosts.map((post) => (
              <li key={post.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <Link href={`/blog/${post.slug}`} style={{ display: 'flex', gap: '1rem', alignItems: 'baseline', padding: '0.9rem 0', textDecoration: 'none' }}>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {toYYMM(post.date)}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>
                    {post.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 대표 작업 */}
        {works.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
              <h2 style={sectionTitle}>작업</h2>
              <Link href="/work" style={moreLink}>전체 보기 →</Link>
            </div>
            <div className="home-work-grid">
              {works.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="card-hover"
                  style={{ display: 'block', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', background: 'var(--surface)' }}
                >
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>{p.name}</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{p.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Lab 진입 */}
        <section>
          <Link
            href="/lab"
            className="card-hover"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', textDecoration: 'none', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem' }}
          >
            <span>
              <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>🧪 Lab</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>직접 만든 UI 인터랙션 {Object.keys(DEMOS).length}개를 눌러보세요</span>
            </span>
            <span style={{ color: 'var(--accent)' }}>→</span>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
