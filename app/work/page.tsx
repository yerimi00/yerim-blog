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
    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 1.25rem' }}>
      {children}
      {count !== undefined && <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{count}</span>}
    </h2>
  )
}

export default async function WorkPage() {
  const projects = await getAllProjects()
  const featured = projects.filter((p) => p.featured)
  const archive = projects.filter((p) => !p.featured)
  const years = projects.map((p) => Number(yearOf(p))).filter(Boolean)
  const summary = [
    `프로젝트 ${projects.length}개`,
    `수상·논문 ${projects.filter((p) => p.award).length}개`,
    years.length ? `${Math.min(...years)}년부터` : '',
  ].filter(Boolean).join(' · ')
  const [custom, ...others] = aiSkillCategories

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
      <header className="work-head" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title">Work</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>{summary}</p>
        </div>
        <nav aria-label="페이지 내 이동" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {JUMPS.map(({ href, label }) => (
            <a key={href} href={href} style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none' }}>{label}</a>
          ))}
        </nav>
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
