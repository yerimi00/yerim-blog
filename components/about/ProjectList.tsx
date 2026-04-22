'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProjectCard from './ProjectCard'
import type { Project } from '@/app/about/[version]/data'

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  const grouped = Object.entries(
    projects.reduce<Record<string, Project[]>>((acc, p) => {
      const year = (p.period || p.updatedAt || '').slice(0, 4) || '기타'
      ;(acc[year] ??= []).push(p)
      return acc
    }, {})
  ).sort(([a], [b]) => Number(b) - Number(a))

  return (
    <div>
      {grouped.map(([year, items], gi) => (
        <div key={year} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', columnGap: '1rem' }}>
          {/* 타임라인 점 + 선 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'var(--accent)', border: '2px solid var(--bg)',
              flexShrink: 0, marginTop: '4px',
            }} />
            {gi < grouped.length - 1 && (
              <div style={{ width: '1px', flex: 1, background: 'var(--border)', marginTop: '4px' }} />
            )}
          </div>

          <div style={{ paddingBottom: gi < grouped.length - 1 ? '2rem' : 0 }}>
            {/* 년도 레이블 */}
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)',
              fontFamily: 'JetBrains Mono, monospace', display: 'block', marginBottom: '0.75rem',
            }}>
              {year}
            </span>

            {/* 프로젝트 목록 */}
            <div>
              {items.map((project, ai) => (
                <div
                  key={project.slug}
                  style={{ borderBottom: ai < items.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <Link href={`/about/projects/${project.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <div
                      onMouseEnter={() => setHovered(project.slug)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ padding: '0.8rem 0', cursor: 'pointer' }}
                    >
                      {/* 행: period + 내용 + 화살표 */}
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                        <span style={{
                          fontSize: '0.72rem', color: 'var(--text-muted)',
                          whiteSpace: 'nowrap', paddingTop: '3px', minWidth: '80px', flexShrink: 0,
                        }}>
                          {project.period}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                            <span style={{
                              fontSize: '0.9rem', fontWeight: 600,
                              color: hovered === project.slug ? 'var(--accent)' : 'var(--text)',
                              transition: 'color 0.15s',
                            }}>
                              {project.name}
                            </span>
                            {project.status === '진행중' && (
                              <span style={{
                                fontSize: '0.68rem', padding: '1px 8px', borderRadius: '999px',
                                background: 'rgba(59,130,246,0.12)', color: 'var(--accent)',
                              }}>
                                진행중
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                            {project.description}
                          </p>
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            {project.roles.map((role) => (
                              <span key={role} style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>#{role}</span>
                            ))}
                            {project.award && (
                              <span style={{ fontSize: '0.68rem', color: '#b45309' }}>🏆 {project.award}</span>
                            )}
                          </div>
                        </div>
                        <span style={{ color: 'var(--accent)', fontSize: '0.9rem', flexShrink: 0, paddingTop: '2px' }}>→</span>
                      </div>

                      {/* 호버 시 카드 슬라이드 다운 */}
                      {project.image && (
                        <div style={{
                          overflow: 'hidden',
                          maxHeight: hovered === project.slug ? '400px' : '0',
                          opacity: hovered === project.slug ? 1 : 0,
                          transition: 'max-height 0.4s ease, opacity 0.3s ease',
                          marginTop: hovered === project.slug ? '0.75rem' : '0',
                          marginLeft: 'calc(80px + 1.25rem)',
                          maxWidth: '500px',
                        }}>
                          <ProjectCard project={project} />
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
