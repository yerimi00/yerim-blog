import Link from 'next/link'
import { getAllPosts } from '@/lib/notion'
import { getAllProjects } from '@/lib/projects'
import { getPublishedQuestions } from '@/lib/interview'
import HomeHero from '@/components/home/HomeHero'
import RecentPosts from '@/components/home/RecentPosts'
import SectionReveal from '@/components/about/SectionReveal'
import { MotionLink } from '@/components/motion/MotionProvider'
import { spring } from '@/components/motion/presets'

export const revalidate = 3600

const TAG_COUNT = 12

const sectionHeading: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.45, color: 'var(--text)', margin: '0.85rem 0 0' }
const sectionLead: React.CSSProperties = { fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: '0.6rem 0 0' }
const textLink: React.CSSProperties = { display: 'inline-block', marginTop: '1rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }

export default async function HomePage() {
  const [posts, projects, questions] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
    getPublishedQuestions(),
  ])
  const featured = projects.filter((p) => p.featured)
  const works = (featured.length ? featured : projects).slice(0, 4)
  const today = questions[0]

  // 많이 쓴 태그 순
  const tagCounts = new Map<string, number>()
  posts.forEach((p) => p.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)))
  const tags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, TAG_COUNT)
    .map(([tag]) => tag)

  return (
    <main className="home-main">
      <HomeHero tags={tags} posts={posts.map(({ slug, title, date, series }) => ({ slug, title, date, series }))} />

      <RecentPosts posts={posts.slice(0, 5)} total={posts.length} />

      {today && (
        <div className="home-wrap">
          <SectionReveal>
            <section className="home-section home-rule">
              <p className="home-marker">Today&apos;s Question</p>
              <h2 style={sectionHeading}>{today.question}</h2>
              <p style={sectionLead}>
                {[today.category, today.level && `난이도 ${today.level}`].filter(Boolean).join(' · ')}
              </p>
              <Link href={`/interview/${today.slug}`} style={textLink}>먼저 생각해 보고 답 확인하기 →</Link>
            </section>
          </SectionReveal>
        </div>
      )}

      {works.length > 0 && (
        <div className="home-wrap">
          <SectionReveal>
            <section className="home-section home-rule">
              <p className="home-marker">Work</p>
              <h2 style={sectionHeading}>직접 만든 것들</h2>
              <p style={sectionLead}>해커톤부터 운영 중인 서비스까지, 기획하고 개발한 프로젝트예요.</p>
              <div className="home-numbered">
                {works.map((p, i) => (
                  <MotionLink key={p.id} href={`/work/${p.slug}`} whileHover={{ y: -3 }} transition={spring.soft} className="home-numbered-item">
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <strong style={{ display: 'block', margin: '0.5rem 0 0.4rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{p.description}</span>
                  </MotionLink>
                ))}
              </div>
              <Link href="/work" style={textLink}>전체 작업 보기 →</Link>
            </section>
          </SectionReveal>
        </div>
      )}
    </main>
  )
}
