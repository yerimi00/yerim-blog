import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProjectView from '@/components/project/ProjectView'
import { projects } from '@/app/about/[version]/data'

export const metadata = { title: 'Project', description: '진행한 프로젝트 모음' }

export default function ProjectPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Project
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            주요 {projects.filter((p) => p.featured).length}개 · 전체 {projects.length}개
          </p>
        </div>
        <ProjectView projects={projects} />
      </main>
      <Footer />
    </>
  )
}
