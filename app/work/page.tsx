import FeaturedWork from '@/components/project/FeaturedWork'
import ProjectArchive from '@/components/project/ProjectArchive'
import AiSkillSection from '@/components/ai-skills/AiSkillSection'
import AiSkillsMore from '@/components/ai-skills/AiSkillsMore'
import { yearOf } from '@/components/project/project-utils'
import { getAllProjects } from '@/lib/projects'
import { aiSkillCategories } from '@/app/data/ai-skills'

export const revalidate = 3600

export const metadata = {
  title: 'Work',
  description: '진행한 프로젝트와 실무에 쓰는 AI 스킬 모음',
  alternates: { canonical: '/work' },
}

const JUMPS = [
  { href: '#featured', label: '대표작' },
  { href: '#archive', label: '아카이브' },
  { href: '#ai-skills', label: 'AI Skills' },
]

const sectionStyle: React.CSSProperties = { scrollMarginTop: '84px', marginBottom: 'clamp(4rem, 9vw, 7rem)' }

function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h2 className="hand" style={{ fontSize: '2.4rem', lineHeight: 1.1, color: 'var(--text)', margin: '0 0 1.5rem' }}>
      {children}
      {count !== undefined && <span style={{ fontSize: '1.3rem', color: 'var(--accent)', marginLeft: '0.5rem' }}>{count}</span>}
    </h2>
  )
}

export default async function WorkPage() {
  const projects = await getAllProjects()
  const featured = projects.filter((p) => p.featured)
  const archive = projects.filter((p) => !p.featured)
  const years = projects.map((p) => Number(yearOf(p))).filter(Boolean)
  const stats = [
    { value: projects.length, label: '프로젝트' },
    { value: projects.filter((p) => p.award).length, label: '수상·논문' },
    { value: years.length ? Math.min(...years) : '-', label: '부터 만들었어요' },
  ]
  const [custom, ...others] = aiSkillCategories

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(2.5rem, 6vw, 4.5rem) 1.5rem 0' }}>
      <header className="work-head" style={{ marginBottom: 'clamp(3rem, 7vw, 5rem)' }}>
        <div>
          <h1 className="hand-title" style={{ fontSize: 'clamp(3.5rem, 9vw, 5.5rem)', lineHeight: 1 }}>Work</h1>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 1.25rem', maxWidth: '460px' }}>
            해커톤부터 운영 중인 서비스까지, 직접 만든 것들을 모았어요.
          </p>
          <nav aria-label="페이지 내 이동" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {JUMPS.map(({ href, label }) => (
              <a key={href} href={href} style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>{label} ↓</a>
            ))}
          </nav>
        </div>
        <dl className="work-stats">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <dd>{value}</dd>
              <dt>{label}</dt>
            </div>
          ))}
        </dl>
      </header>

      {featured.length > 0 && (
        <section id="featured" style={sectionStyle}>
          <SectionTitle>대표작</SectionTitle>
          <FeaturedWork projects={featured} />
        </section>
      )}

      <section id="archive" style={sectionStyle}>
        <SectionTitle count={archive.length}>아카이브</SectionTitle>
        <ProjectArchive projects={archive} />
      </section>

      <section id="ai-skills" style={sectionStyle}>
        <SectionTitle>AI Skills</SectionTitle>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 0 2rem' }}>
          개발 작업에 Claude Code를 활용하면서 직접 만들어 쓰는 자동화예요.
        </p>
        <AiSkillSection category={custom} />
        <AiSkillsMore categories={others} />
      </section>
    </main>
  )
}
