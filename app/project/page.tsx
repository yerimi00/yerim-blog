import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProjectView from '@/components/project/ProjectView'
import ProjectHeroBanner from '@/components/project/ProjectHeroBanner'
import { projects } from '@/app/about/[version]/data'

export const metadata = { title: 'Project', description: '진행한 프로젝트 모음' }

export default function ProjectPage() {
  const featured = projects.filter((p) => p.featured)

  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* 주요 프로젝트 배너 */}
        {featured.length > 0 && (
          <section style={{ margin: '2rem 0 3rem' }}>
            <ProjectHeroBanner projects={featured} />
          </section>
        )}

        {/* 전체 프로젝트 */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>전체 프로젝트</h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{projects.length}개</span>
          </div>
          <ProjectView projects={projects} />
        </div>

      </main>
      <Footer />
    </>
  )
}
