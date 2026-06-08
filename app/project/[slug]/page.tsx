import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IoIosArrowForward } from 'react-icons/io'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'
import { getPostsByProject } from '@/lib/notion'
import type { Post } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) return {}
  return { title: `${project.name} — 프로젝트`, description: project.description }
}

const sectionStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  marginBottom: '1rem',
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <div
        className="card-hover"
        style={{
          padding: '1.1rem 1.5rem',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          background: 'var(--surface-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {post.title}
          </p>
          {post.description && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {post.description}
            </p>
          )}
        </div>
        <IoIosArrowForward style={{ color: 'var(--accent)', fontSize: '1rem', flexShrink: 0 }} />
      </div>
    </Link>
  )
}

function PostGroup({ label, posts }: { label: string; posts: Post[] }) {
  if (!posts.length) return null
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  )
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, postGroups] = await Promise.all([
    getProjectBySlug(params.slug),
    getPostsByProject(params.slug),
  ])
  if (!project) notFound()

  const hasRelatedPosts =
    postGroups.troubleshooting.length + postGroups.retrospective.length + postGroups.other.length > 0

  return (
    <>
      <Header />
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              {project.name}
            </h1>
            {project.status === '진행중' && (
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 12px', borderRadius: '999px', background: 'rgba(59,130,246,0.12)', color: 'var(--accent)' }}>
                진행중
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {project.period && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{project.period}</span>
            )}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {project.roles.map((role) => (
                <span key={role} style={{ fontSize: '0.72rem', fontWeight: 500, padding: '2px 9px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {role}
                </span>
              ))}
            </div>
          </div>

          {project.award && (
            <div style={{ fontSize: '0.82rem', color: '#b45309', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '8px', padding: '5px 14px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              🏆 {project.award}
            </div>
          )}
        </div>

        {/* 썸네일 이미지 */}
        {project.image && (
          <div style={{ marginBottom: '2.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={project.image} alt={project.name} style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
          </div>
        )}

        {/* 프로젝트 개요 */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={sectionStyle}>프로젝트 개요</h2>
          <p style={{ fontSize: '0.925rem', color: 'var(--text)', lineHeight: 1.8, margin: 0 }}>
            {project.overview || project.description}
          </p>
        </section>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />

        {/* 사용 기술 */}
        {project.tech.length > 0 && (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={sectionStyle}>사용 기술</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.tech.map((t) => (
                  <span key={t} className="tag-badge" style={{ fontSize: '0.82rem', padding: '4px 12px' }}>{t}</span>
                ))}
              </div>
            </section>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />
          </>
        )}

        {/* 관련 블로그 글 */}
        {hasRelatedPosts && (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={sectionStyle}>관련 블로그 글</h2>
              <PostGroup label="트러블슈팅" posts={postGroups.troubleshooting} />
              <PostGroup label="회고" posts={postGroups.retrospective} />
              <PostGroup label="기타" posts={postGroups.other} />
            </section>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />
          </>
        )}

        {/* 링크 */}
        {(project.github || project.url) && (
          <section>
            <h2 style={sectionStyle}>링크</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  GitHub <IoIosArrowForward />
                </a>
              )}
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  서비스 바로가기 <IoIosArrowForward />
                </a>
              )}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}
