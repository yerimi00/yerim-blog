import Link from 'next/link'
import { getAllPosts } from '@/lib/notion'
import { getAllProjects } from '@/lib/projects'
import { getPublishedQuestions } from '@/lib/interview'
import TodayQuestionCard from '@/components/interview/TodayQuestionCard'
import HomeHero from '@/components/home/HomeHero'
import TiltCard from '@/components/home/TiltCard'
import SectionReveal from '@/components/about/SectionReveal'
import ContainerScroll from '@/components/home/ContainerScroll'
import { DEMOS } from '@/app/data/interactions/interactions-data'

export const revalidate = 3600

const HERO_TAG_COUNT = 14

const sectionTitle: React.CSSProperties = { fontFamily: 'var(--font-hand)', fontSize: '1.75rem', fontWeight: 400, lineHeight: 1, color: 'var(--text)', margin: 0 }
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

  // 많이 쓴 태그 순으로 히어로 칩 구성
  const tagCounts = new Map<string, number>()
  posts.forEach((p) => p.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)))
  const heroTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, HERO_TAG_COUNT)
    .map(([tag]) => tag)

  return (
    <>
      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <HomeHero tags={heroTags} />

        {/* 오늘의 면접 질문 */}
        {today && (
          <SectionReveal style={{ marginBottom: '3rem' }}>
            <TiltCard>
              <TodayQuestionCard question={today} />
            </TiltCard>
          </SectionReveal>
        )}

        {/* 최근 글 — 스크롤하면 기울어진 화면이 펴진다 */}
        <ContainerScroll
          title={
            <>
              <p className="hand" style={{ fontSize: '1.5rem', color: 'var(--accent)', margin: '0 0 0.25rem' }}>요즘 쓰고 있는 것들</p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
                배운 건 바로바로 기록해요
              </h2>
            </>
          }
        >
          <div className="browser-chrome" aria-hidden="true">
            <span /><span /><span />
            <p>yerim.dev/blog</p>
          </div>
          <div style={{ padding: '0.5rem 1.25rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '0.75rem 0 0.25rem' }}>
              <h3 style={sectionTitle}>최근 글</h3>
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
          </div>
        </ContainerScroll>

        {/* 대표 작업 */}
        {works.length > 0 && (
          <SectionReveal style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
              <h2 style={sectionTitle}>작업</h2>
              <Link href="/work" style={moreLink}>전체 보기 →</Link>
            </div>
            <div className="home-work-grid">
              {works.map((p) => (
                <TiltCard key={p.id}>
                  <Link
                    href={`/work/${p.slug}`}
                    className="card-hover"
                    style={{ display: 'block', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', background: 'var(--surface)' }}
                  >
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>{p.name}</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{p.description}</p>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </SectionReveal>
        )}

        {/* Lab 진입 */}
        <SectionReveal>
          <TiltCard>
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
          </TiltCard>
        </SectionReveal>
      </main>
    </>
  )
}
