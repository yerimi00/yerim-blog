import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { projects } from '@/app/about/[version]/data'
import hljs from 'highlight.js/lib/core'
import langTs from 'highlight.js/lib/languages/typescript'
import langYaml from 'highlight.js/lib/languages/yaml'
import langJson from 'highlight.js/lib/languages/json'
import langBash from 'highlight.js/lib/languages/bash'

hljs.registerLanguage('typescript', langTs)
hljs.registerLanguage('yaml', langYaml)
hljs.registerLanguage('json', langJson)
hljs.registerLanguage('bash', langBash)

function detectLang(filename: string): string {
  const f = filename.toLowerCase()
  if (f.endsWith('.yml') || f.endsWith('.yaml') || f.includes('.yml')) return 'yaml'
  if (f.endsWith('.json') || f.includes('manifest') || f.includes('package.json')) return 'json'
  if (f.includes('pre-commit') || f.endsWith('.sh')) return 'bash'
  return 'typescript'
}

function highlightCode(content: string, filename: string): string {
  const lang = detectLang(filename)
  try {
    return hljs.highlight(content, { language: lang }).value
  } catch {
    return content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
}

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

        {/* ── 회고 인트로 ── */}
        {project.intro && (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <blockquote
                style={{
                  borderLeft: '3px solid var(--accent)',
                  paddingLeft: '1rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  lineHeight: 1.8,
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                {project.intro}
              </blockquote>
            </section>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />
          </>
        )}

        {/* ── 문제 해결 경험 ── */}
        {project.problemSolving && project.problemSolving.length > 0 && (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={sectionStyle}>문제 해결 경험</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {project.problemSolving.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1.5rem',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      background: 'var(--bg-secondary)',
                    }}
                  >
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 1rem' }}>
                      {item.title}
                    </p>

                    {/* 구조화된 문제/원인/해결/결과 */}
                    {(item.problem || item.cause || item.solution || item.result) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: item.code && item.code.length > 0 ? '1.25rem' : 0 }}>
                        {(
                          [
                            { label: '문제', text: item.problem, color: '#ef4444' },
                            { label: '원인', text: item.cause, color: '#f97316' },
                            { label: '해결', text: item.solution, color: 'var(--accent)' },
                            { label: '결과', text: item.result, color: '#22c55e' },
                          ] as { label: string; text: string | undefined; color: string }[]
                        )
                          .filter((s) => s.text)
                          .map(({ label, text, color }) => (
                            <div key={label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: color === 'var(--accent)' ? 'rgba(59,130,246,0.1)' : `${color}18`,
                                  color,
                                  flexShrink: 0,
                                  marginTop: '0.2rem',
                                  letterSpacing: '0.03em',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {label}
                              </span>
                              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                                {text}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* 코드 스니펫
                    {item.code && item.code.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {item.code.map((snippet, j) => (
                          <div key={j} className="code-dark">
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                fontSize: '0.72rem',
                                color: '#8b949e',
                                background: '#252526',
                                border: '1px solid #3c3c3c',
                                borderBottom: 'none',
                                borderRadius: '6px 6px 0 0',
                                padding: '4px 12px',
                                fontFamily: 'JetBrains Mono, Menlo, monospace',
                              }}
                            >
                              {snippet.filename}
                            </div>
                            <pre
                              style={{
                                fontSize: '0.84rem',
                                lineHeight: 1.75,
                                padding: '1.25rem 1.5rem',
                                borderRadius: '0 6px 6px 6px',
                                background: '#1e1e1e',
                                border: '1px solid #3c3c3c',
                                overflowX: 'auto',
                                margin: 0,
                                color: '#d4d4d4',
                                fontFamily: 'JetBrains Mono, Menlo, monospace',
                                tabSize: 2,
                              }}
                            >
                              <code dangerouslySetInnerHTML={{ __html: highlightCode(snippet.content, snippet.filename) }} />
                            </pre>
                          </div>
                        ))}
                      </div>
                    )} */}

                    {/* 레거시 body 포맷 */}
                    {item.body && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                        {item.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />
          </>
        )}

        {/* ── 마치며 ── */}
        {project.conclusion && (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={sectionStyle}>마치며</h2>
              {project.conclusion.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: '0.925rem', color: 'var(--text)', lineHeight: 1.8, margin: i > 0 ? '1rem 0 0' : 0 }}>
                  {para}
                </p>
              ))}
            </section>
            <hr style={{ borderColor: 'var(--border)', marginBottom: '2.5rem' }} />
          </>
        )}

        {/* ── 관련 블로그 글 ── */}
        {project.relatedPosts && project.relatedPosts.length > 0 && (
          <>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={sectionStyle}>관련 블로그 글</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {project.relatedPosts.map((slug) => (
                  <Link
                    key={slug}
                    href={`/blog/${slug}`}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    /blog/{slug} →
                  </Link>
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
