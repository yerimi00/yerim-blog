import ProjectView from '@/components/project/ProjectView'
import ProjectSqueezeCarousel from '@/components/project/ProjectSqueezeCarousel'
import AiSkillSection from '@/components/ai-skills/AiSkillSection'
import { getAllProjects } from '@/lib/projects'
import { aiSkillCategories } from '@/app/data/ai-skills'

export const revalidate = 3600

export const metadata = {
  title: 'Work',
  description: '진행한 프로젝트와 실무에 쓰는 AI 스킬 모음',
  alternates: { canonical: '/work' },
}

export default async function WorkPage() {
  const projects = await getAllProjects()
  // 히어로: 이미지 있는 프로젝트, Featured 먼저 (최대 8개)
  const heroProjects = projects
    .filter((p) => p.image)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 8)

  return (
    <>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

        {heroProjects.length > 0 && (
          <div style={{ margin: '2rem 0 3rem' }}>
            <ProjectSqueezeCarousel projects={heroProjects} />
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>전체 프로젝트</h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{projects.length}개</span>
          </div>
          <ProjectView projects={projects} />
        </div>

        <section id="ai-skills" style={{ marginTop: '4rem', scrollMarginTop: '80px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
              AI Skills
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '640px' }}>
              개발 작업에 Claude Code를 활용하면서 실제로 쓰고 있는 스킬과 자동화입니다. 커스텀으로 만든
              것도 있고, 기본 제공되는 것을 그대로 쓰는 것도 있습니다.
            </p>
          </div>

          {aiSkillCategories.map((category) => (
            <AiSkillSection key={category.title} category={category} />
          ))}
        </section>

      </main>
    </>
  )
}
