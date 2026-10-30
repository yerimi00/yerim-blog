'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import type { NotionProject } from '@/lib/projects'

const INTERVAL = 5000

// 선택된 프로젝트만 넓게, 나머지는 거리만큼 좁은 띠로 눌린 캐러셀
export default function ProjectSqueezeCarousel({ projects }: { projects: NotionProject[] }) {
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = projects.length

  useEffect(() => {
    if (n <= 1 || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setActive((i) => (i + 1) % n), INTERVAL)
    return () => clearTimeout(t)
  }, [active, n, paused])

  if (!n) return null
  const current = projects[active]
  const go = (step: number) => setActive((i) => (i + step + n) % n)

  return (
    <section
      className="squeeze"
      aria-roledescription="carousel"
      aria-label="대표 프로젝트"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="squeeze-head">
        <p className="hand squeeze-kicker">대표 작업</p>
        <div className="squeeze-arrows">
          <button type="button" onClick={() => go(-1)} aria-label="이전 프로젝트"><IoIosArrowBack /></button>
          <button type="button" onClick={() => go(1)} aria-label="다음 프로젝트"><IoIosArrowForward /></button>
        </div>
      </div>

      <div className="squeeze-track">
        {projects.map((p, i) => {
          const isActive = i === active
          return (
            <button
              key={p.id}
              type="button"
              className="squeeze-slide"
              data-active={isActive || undefined}
              style={{ '--dist': Math.abs(i - active) } as React.CSSProperties}
              onClick={() => (isActive ? router.push(`/work/${p.slug}`) : setActive(i))}
              aria-label={isActive ? `${p.name} 자세히 보기` : `${p.name} 보기`}
              aria-current={isActive || undefined}
            >
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
              ) : (
                <span className="squeeze-fallback">{p.name.slice(0, 1)}</span>
              )}
              <span className="squeeze-label">{p.name}</span>
            </button>
          )
        })}
      </div>

      <div className="squeeze-caption" aria-live="polite">
        <p>
          <strong>{current.name}.</strong> {current.description}
        </p>
        <Link href={`/work/${current.slug}`} className="squeeze-cta">
          자세히 보기 <IoIosArrowForward />
        </Link>
      </div>
    </section>
  )
}
