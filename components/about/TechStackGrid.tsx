'use client'

import { useState, useRef, useLayoutEffect } from 'react'
import type { IconType } from 'react-icons'
import {
  SiHtml5, SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiRecoil, SiReactquery, SiStyledcomponents, SiTailwindcss,
  SiFlutter, SiFigma, SiSlack, SiDiscord, SiIntellijidea,
  SiGit, SiGithub, SiApple, SiSpringboot, SiOpenjdk,
  SiHibernate, SiMysql, SiNotion,
} from 'react-icons/si'
import { DiCss3, DiWindows, DiVisualstudio, DiJava } from 'react-icons/di'

const ICON_MAP: Record<string, IconType> = {
  SiHtml5, SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiRecoil, SiReactquery, SiStyledcomponents, SiTailwindcss,
  SiFlutter, SiFigma, SiSlack, SiDiscord, SiIntellijidea,
  SiGit, SiGithub, SiApple, SiSpringboot, SiOpenjdk,
  SiHibernate, SiMysql, SiNotion,
  DiCss3, DiWindows, DiVisualstudio, DiJava,
}

const ICON_COLOR: Record<string, string> = {
  SiHtml5:            '#E34F26',
  DiCss3:             '#1572B6',
  SiJavascript:       '#F7DF1E',
  SiTypescript:       '#3178C6',
  SiReact:            '#61DAFB',
  SiNextdotjs:        'var(--text)',
  SiRecoil:           '#3578E5',
  SiReactquery:       '#FF4154',
  SiStyledcomponents: '#DB7093',
  SiTailwindcss:      '#06B6D4',
  SiFlutter:          '#02569B',
  SiFigma:            '#F24E1E',
  SiSlack:            '#4A154B',
  SiDiscord:          '#5865F2',
  DiVisualstudio:     '#007ACC',
  SiIntellijidea:     '#FE315D',
  SiGit:              '#F05032',
  SiGithub:           'var(--text)',
  SiApple:            'var(--text)',
  DiWindows:          '#0078D4',
  SiSpringboot:       '#6DB33F',
  DiJava:             '#ED8B00',
  SiOpenjdk:          '#ED8B00',
  SiHibernate:        '#59666C',
  SiMysql:            '#4479A1',
  SiNotion:           'var(--text)',
}

export type TechItem = {
  name: string
  group: string
  level: string
  desc: string
  icon: string
}

function TechIcon({ icon, name, size = 28 }: { icon: string; name: string; size?: number }) {
  if (icon.startsWith('img:')) {
    return (
      <img
        src={`/icons/${icon.slice(4)}.svg`}
        alt={name}
        width={size}
        height={size}
        style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }}
      />
    )
  }
  const IconComponent = ICON_MAP[icon]
  if (!IconComponent) {
    return (
      <span style={{
        width: size, height: size,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.55rem', fontWeight: 700, color: 'var(--accent)',
        border: '1px solid var(--border)', borderRadius: '4px', flexShrink: 0,
      }}>
        {name.slice(0, 3).toUpperCase()}
      </span>
    )
  }
  const color = ICON_COLOR[icon] ?? 'var(--text-muted)'
  return <IconComponent size={size} style={{ color, display: 'block', flexShrink: 0 }} />
}

function TechPopup({ tech }: { tech: TechItem }) {
  const ref = useRef<HTMLDivElement>(null)
  const [leftAdjust, setLeftAdjust] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const overflow = rect.right - (window.innerWidth - 8)
    if (overflow > 0) setLeftAdjust(-overflow)
  }, [])

  const tailLeft = 34 - leftAdjust

  return (
    <div ref={ref} style={{
      position: 'absolute',
      bottom: 'calc(100% + 10px)',
      left: leftAdjust,
      zIndex: 50,
      width: '210px',
      background: 'var(--surface-container)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '0.875rem 1rem',
      boxShadow: 'var(--shadow-floating)',
      pointerEvents: 'none',
    }}>
      {/* 말풍선 꼬리 — 카드 기준 정렬, 뷰포트 보정 반영 */}
      <div style={{
        position: 'absolute',
        bottom: '-5px',
        left: `${tailLeft}px`,
        transform: 'translateX(-50%) rotate(45deg)',
        width: '10px',
        height: '10px',
        background: 'var(--surface-container)',
        borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <TechIcon icon={tech.icon} name={tech.name} size={20} />
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)' }}>{tech.name}</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '0.62rem', fontWeight: 700,
          padding: '1px 6px', borderRadius: '999px',
          background: 'rgba(59,130,246,0.12)',
          color: 'var(--accent)',
          whiteSpace: 'nowrap',
        }}>
          {tech.level}
        </span>
      </div>
      <p style={{
        fontSize: '0.78rem', color: 'var(--text-secondary)',
        lineHeight: 1.65, margin: 0,
      }}>
        {tech.desc}
      </p>
    </div>
  )
}

export default function TechStackGrid({ techStack }: { techStack: TechItem[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [tapped, setTapped] = useState<string | null>(null)

  const groups = Array.from(new Set(techStack.map((t) => t.group)))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {groups.map((group) => {
        const items = techStack.filter((t) => t.group === group)
        return (
          <div key={group}>
            <p style={{
              fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)',
              letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem',
            }}>
              {group}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {items.map((tech) => {
                const isVisible = hovered === tech.name || (tapped === tech.name && !hovered)
                return (
                  <div
                    key={tech.name}
                    style={{ position: 'relative', zIndex: isVisible ? 10 : 'auto' }}
                    onMouseEnter={() => setHovered(tech.name)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {isVisible && <TechPopup tech={tech} />}
                    <button
                      onClick={() => setTapped(tapped === tech.name ? null : tech.name)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                        padding: '0.75rem 0.875rem',
                        border: `1.5px solid ${isVisible ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '12px',
                        background: isVisible ? 'rgba(59,130,246,0.07)' : 'var(--bg-secondary)',
                        cursor: 'pointer', minWidth: '68px', outline: 'none',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      <TechIcon icon={tech.icon} name={tech.name} size={28} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {tech.name}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
