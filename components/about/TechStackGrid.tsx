'use client'

import { useState } from 'react'
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
  SiNextdotjs:        'var(--text)',   // 브랜드 컬러 #000 — 다크모드 대응
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
  SiGithub:           'var(--text)',   // 브랜드 컬러 #181717 — 다크모드 대응
  SiApple:            'var(--text)',   // 브랜드 컬러 #000 — 다크모드 대응
  DiWindows:          '#0078D4',
  SiSpringboot:       '#6DB33F',
  DiJava:             '#ED8B00',
  SiOpenjdk:          '#ED8B00',
  SiHibernate:        '#59666C',
  SiMysql:            '#4479A1',
  SiNotion:           'var(--text)',   // 브랜드 컬러 #000 — 다크모드 대응
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

export default function TechStackGrid({ techStack }: { techStack: TechItem[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const selectedItem = techStack.find((t) => t.name === selected) ?? null

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
              {items.map((tech) => (
                <button
                  key={tech.name}
                  onClick={() => setSelected(selected === tech.name ? null : tech.name)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem',
                    padding: '0.75rem 0.875rem',
                    border: `1.5px solid ${selected === tech.name ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '12px',
                    background: selected === tech.name ? 'rgba(59,130,246,0.07)' : 'var(--bg-secondary)',
                    cursor: 'pointer', minWidth: '68px', outline: 'none',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <TechIcon icon={tech.icon} name={tech.name} size={28} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {tech.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {selectedItem && (
        <div style={{
          padding: '1rem 1.25rem', border: '1px solid var(--accent)', borderRadius: '10px',
          background: 'rgba(59,130,246,0.04)', display: 'flex', alignItems: 'flex-start', gap: '1rem',
        }}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            <TechIcon icon={selectedItem.icon} name={selectedItem.name} size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>{selectedItem.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{selectedItem.group}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '1px 8px', borderRadius: '999px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent)' }}>
                {selectedItem.level}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              {selectedItem.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
