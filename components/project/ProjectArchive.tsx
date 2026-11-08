'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import type { NotionProject } from '@/lib/projects'
import { MotionLink } from '@/components/motion/MotionProvider'
import TabButton from '@/components/motion/TabButton'
import { fastTween, spring } from '@/components/motion/presets'
import { disciplinesOf, yearOf } from '@/components/project/project-utils'

const FILTERS: { label: string; match: (p: NotionProject) => boolean }[] = [
  { label: '전체', match: () => true },
  { label: 'FE', match: (p) => p.roles.includes('FE') },
  { label: 'BE', match: (p) => p.roles.includes('BE') },
  { label: '기획·PM', match: (p) => p.roles.includes('기획') || p.roles.includes('PM') },
  { label: '연구', match: (p) => p.roles.includes('연구') },
  { label: '수상·논문', match: (p) => !!p.award },
]

const PREVIEW_W = 280
const PREVIEW_H = 175
const CURSOR_GAP = 20

const titleVariants = { rest: { color: 'var(--text)' }, hover: { color: 'var(--accent)' } }

// 대표작 외 프로젝트 색인. 연도는 그룹의 첫 행에만 표시하고, 마우스를 올리면 커서 옆에 이미지가 따라온다
export default function ProjectArchive({ projects }: { projects: NotionProject[] }) {
  const [filter, setFilter] = useState('전체')
  const [preview, setPreview] = useState<string | null>(null)
  const x = useSpring(useMotionValue(0), spring.soft)
  const y = useSpring(useMotionValue(0), spring.soft)

  const tabs = FILTERS.filter((f) => projects.some(f.match))
  const match = FILTERS.find((f) => f.label === filter)?.match ?? (() => true)
  const visible = projects
    .filter(match)
    .map((p) => ({ p, year: yearOf(p) }))
    .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))

  // 미리보기가 빈 상자로 뜨지 않도록 마우스가 목록에 처음 들어올 때 이미지를 받아 둔다
  const preloaded = useRef(false)
  const preloadPreviews = (e: React.PointerEvent) => {
    if (preloaded.current || e.pointerType !== 'mouse') return
    preloaded.current = true
    projects.forEach((p) => {
      if (p.image) new Image().src = p.image
    })
  }

  const moveTo = (e: React.PointerEvent, jump = false) => {
    const left = Math.min(e.clientX + CURSOR_GAP, window.innerWidth - PREVIEW_W - 8)
    const top = Math.max(8, Math.min(e.clientY - PREVIEW_H / 2, window.innerHeight - PREVIEW_H - 8))
    if (jump) {
      x.jump(left)
      y.jump(top)
    } else {
      x.set(left)
      y.set(top)
    }
  }

  return (
    <div onPointerEnter={preloadPreviews} onPointerLeave={() => setPreview(null)}>
      <div className="series-tab-bar" style={{ marginBottom: '0.25rem' }}>
        {tabs.map((f) => (
          <TabButton key={f.label} active={filter === f.label} onClick={() => setFilter(f.label)}>
            {f.label} <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{projects.filter(f.match).length}</span>
          </TabButton>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map(({ p, year }, i) => (
            <motion.li
              key={p.slug}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <MotionLink
                href={`/work/${p.slug}`}
                className="work-row"
                initial="rest"
                animate="rest"
                whileHover="hover"
                onPointerEnter={(e: React.PointerEvent) => {
                  if (e.pointerType !== 'mouse' || !p.image) return setPreview(null)
                  moveTo(e, preview === null)
                  setPreview(p.image)
                }}
                onPointerMove={(e: React.PointerEvent) => {
                  if (e.pointerType === 'mouse') moveTo(e)
                }}
              >
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {visible[i - 1]?.year === year ? '' : year}
                </span>
                <span style={{ minWidth: 0 }}>
                  <motion.span variants={titleVariants} transition={fastTween} style={{ display: 'inline', fontSize: '1rem', fontWeight: 700 }}>
                    {p.name}
                  </motion.span>
                  {p.status === '진행중' && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)' }}>진행중</span>
                  )}
                  {p.description && (
                    <span style={{ display: 'block', marginTop: '0.15rem', fontSize: '0.84rem', lineHeight: 1.55, color: 'var(--text-muted)' }}>
                      {p.description}
                    </span>
                  )}
                  {p.award && (
                    <span className="hand" style={{ display: 'block', marginTop: '0.2rem', fontSize: '1.1rem', lineHeight: 1.25, color: 'var(--accent)' }}>
                      🏆 {p.award}
                    </span>
                  )}
                </span>
                <span className="work-row-roles">{disciplinesOf(p).join(' · ')}</span>
              </MotionLink>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {preview && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              x,
              y,
              width: PREVIEW_W,
              height: PREVIEW_H,
              zIndex: 60,
              pointerEvents: 'none',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              boxShadow: 'var(--shadow-floating)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
