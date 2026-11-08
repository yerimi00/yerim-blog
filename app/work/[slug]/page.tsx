import { notFound } from 'next/navigation'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'
import { getPostsByProject } from '@/lib/notion'
import PostCard from '@/components/blog/PostCard'
import { HoverFade } from '@/components/motion/Hover'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween } from '@/components/motion/presets'
import { disciplinesOf, isLead } from '@/components/project/project-utils'
import type { Post } from '@/types'
import { ArrowBack, ArrowOut, ArrowRight } from '@/components/ui/text-arrows'

export const revalidate = 3600

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) return {}
  return {
    title: `${project.name} — Work`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
  }
}

const headingStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 600,
  color: 'var(--text)',
  margin: '0 0 1rem',
}

const sectionGap: React.CSSProperties = { marginBottom: '3rem' }

const linkButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: '38px',
  padding: '0 1rem',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  fontSize: '0.85rem',
  fontWeight: 500,
  color: 'var(--text)',
  textDecoration: 'none',
}

function PostGroup({ label, posts }: { label: string; posts: Post[] }) {
  if (!posts.length) return null
  return (
    <div style={{ marginBottom: '2rem' }}>
      <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>{label}</p>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  )
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, postGroups, projects] = await Promise.all([
    getProjectBySlug(params.slug),
    getPostsByProject(params.slug),
    getAllProjects(),
  ])
  if (!project) notFound()

  const hasRelatedPosts = postGroups.troubleshooting.length + postGroups.retrospective.length > 0
  const next = projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length]
  const links = [
    { href: project.github, label: 'GitHub' },
    { href: project.url, label: '서비스 바로가기' },
  ].filter((l) => l.href)

  return (
    <main style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem 0' }}>
      <MotionLink
        href="/work"
        whileHover={{ x: -3, color: 'var(--accent)' }}
        transition={fastTween}
        style={{ display: 'inline-block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}
      >
        <ArrowBack />Work
      </MotionLink>

      <header style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: '0.75rem' }}>
          {project.name}
        </h1>
        {project.description && (
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 1.25rem' }}>{project.description}</p>
        )}
        <dl className="work-feature-meta">
          {project.period && (
            <div>
              <dt>기간</dt>
              <dd>{project.period}</dd>
            </div>
          )}
          <div>
            <dt>역할</dt>
            <dd>{disciplinesOf(project).join(' · ')}{isLead(project) && ' (팀장)'}</dd>
          </div>
          {project.status === '진행중' && (
            <div>
              <dt>상태</dt>
              <dd style={{ color: 'var(--accent)' }}>진행중</dd>
            </div>
          )}
        </dl>
        {project.award && (
          <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--accent)', margin: '0.85rem 0 0' }}>🏆 {project.award}</p>
        )}
        {links.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            {links.map(({ href, label }) => (
              <HoverFade key={label} style={{ display: 'inline-block' }}>
                <a href={href} target="_blank" rel="noopener noreferrer" style={linkButton}>{label}<ArrowOut /></a>
              </HoverFade>
            ))}
          </div>
        )}
      </header>

      {project.image && (
        <div className="work-feature-mat" style={sectionGap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={project.name} />
        </div>
      )}

      {project.overview && (
        <section style={sectionGap}>
          <h2 style={headingStyle}>프로젝트 개요</h2>
          <p style={{ fontSize: '0.98rem', lineHeight: 1.8, color: 'var(--text)', margin: 0 }}>{project.overview}</p>
        </section>
      )}

      {project.tech.length > 0 && (
        <section style={sectionGap}>
          <h2 style={headingStyle}>사용 기술</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.tech.map((t) => (
              <span key={t} className="tag-badge" style={{ fontSize: '0.82rem', padding: '4px 12px' }}>{t}</span>
            ))}
          </div>
        </section>
      )}

      {hasRelatedPosts && (
        <section style={sectionGap}>
          <h2 style={headingStyle}>관련 블로그 글</h2>
          <PostGroup label="트러블슈팅" posts={postGroups.troubleshooting} />
          <PostGroup label="회고" posts={postGroups.retrospective} />
        </section>
      )}

      {next && next.slug !== project.slug && (
        <nav aria-label="다음 프로젝트" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>다음 프로젝트</p>
          <MotionLink
            href={`/work/${next.slug}`}
            whileHover={{ x: 4, color: 'var(--accent)' }}
            transition={fastTween}
            style={{ display: 'inline-block', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}
          >
            {next.name} <ArrowRight />
          </MotionLink>
        </nav>
      )}
    </main>
  )
}
