'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AboutVersionContent from './AboutVersionContent'
import AboutToc from './AboutToc'
import type { AboutVersion } from './AboutIntro'

const VERSIONS: AboutVersion[] = ['fe', 'be', 'pm']
const LABELS: Record<AboutVersion, string> = { fe: 'FE', be: 'BE', pm: 'PM' }

export default function AboutVersionSwiper({ initialVersion }: { initialVersion: string }) {
  const router = useRouter()
  const initIdx = Math.max(0, VERSIONS.indexOf(initialVersion as AboutVersion))

  const [activeIdx, setActiveIdx] = useState(initIdx)
  const [contentKey, setContentKey] = useState(0)
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')
  const interactedRef = useRef(false)
  const n = VERSIONS.length

  const goTo = (targetIdx: number) => {
    if (targetIdx === activeIdx) return
    interactedRef.current = true
    setSlideDir(targetIdx > activeIdx ? 'left' : 'right')
    setActiveIdx(targetIdx)
    setContentKey((k) => k + 1)
    router.replace(`/about/${VERSIONS[targetIdx]}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <AboutToc key={VERSIONS[activeIdx]} />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem' }}>

        {/* 탭 바 */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            marginBottom: '2.5rem',
          }}
        >
          {VERSIONS.map((v, i) => (
            <button
              key={v}
              onClick={() => goTo(i)}
              style={{
                flex: 1,
                padding: '0.75rem 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: i === activeIdx ? 700 : 400,
                color: i === activeIdx ? 'var(--text)' : 'var(--text-muted)',
                fontFamily: 'Pretendard, sans-serif',
                transition: 'color 0.2s',
              }}
            >
              {LABELS[v]}
            </button>
          ))}

          {/* 슬라이딩 인디케이터 */}
          <span
            style={{
              position: 'absolute',
              bottom: -1,
              left: 0,
              width: `${100 / n}%`,
              height: 2,
              background: 'var(--accent)',
              borderRadius: '9999px',
              transform: `translateX(${activeIdx * 100}%)`,
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {/* 콘텐츠 */}
        <style>{`
          @keyframes about-slide-from-right {
            from { transform: translateX(36px); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes about-slide-from-left {
            from { transform: translateX(-36px); opacity: 0; }
            to   { transform: translateX(0);     opacity: 1; }
          }
        `}</style>
        <div
          key={contentKey}
          style={{
            animation: interactedRef.current
              ? `about-slide-from-${slideDir === 'left' ? 'right' : 'left'} 0.28s ease-out`
              : 'none',
          }}
        >
          <AboutVersionContent version={VERSIONS[activeIdx]} />
        </div>

      </main>
    </>
  )
}
