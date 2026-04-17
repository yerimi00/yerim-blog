import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { projects } from '@/app/about/[version]/data'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)
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

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)
  if (!project) notFound()

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
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '3px 12px',
                  borderRadius: '999px',
                  background: 'rgba(59,130,246,0.12)',
                  color: 'var(--accent)',
                }}
              >
                진행중
              </span>
            )}
          </div>

          {/* 메타 정보 */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {project.period && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{project.period}</span>
            )}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {project.roles.map((role) => (
                <span
                  key={role}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    padding: '2px 9px',
                    borderRadius: '4px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* 수상 */}
          {project.award && (
            <div
              style={{
                fontSize: '0.82rem',
                color: '#b45309',
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.3)',
                borderRadius: '8px',
                padding: '5px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
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

        {/* ── 프로젝트 개요 ── */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={sectionStyle}>프로젝트 개요</h2>
          <p style={{ fontSize: '0.925rem', color: 'var(--text)', lineHeight: 1.8, margin: 0 }}>
            {project.overview ?? project.description}
          </p>
        </section>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />

        {/* ── 사용 기술 ── */}
        {project.tech && project.tech.length > 0 && (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={sectionStyle}>사용 기술</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.tech.map((t) => (
                  <span key={t} className="tag-badge" style={{ fontSize: '0.82rem', padding: '4px 12px' }}>
                    {t}
                  </span>
                ))}
              </div>
            </section>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />
          </>
        )}

        {/* ── 담당 기능 ── */}
        {project.responsibilities && project.responsibilities.length > 0 && (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={sectionStyle}>담당 기능</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {project.responsibilities.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                      fontSize: '0.9rem',
                      color: 'var(--text)',
                      lineHeight: 1.7,
                    }}
                  >
                    <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.3rem', fontSize: '0.55rem' }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />
          </>
        )}

        {/* ── 문제 해결 경험 ── */}
        {project.problemSolving && project.problemSolving.length > 0 && (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={sectionStyle}>문제 해결 경험</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {project.problemSolving.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1.1rem 1.25rem',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      background: 'var(--bg-secondary)',
                    }}
                  >
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.5rem' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />
          </>
        )}

        {/* ── 링크 ── */}
        {(project.github || project.url) && (
          <section>
            <h2 style={sectionStyle}>링크</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.875rem', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  GitHub →
                </a>
              )}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.875rem', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  서비스 바로가기 →
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
