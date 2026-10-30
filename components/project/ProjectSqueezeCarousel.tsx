'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import type { NotionProject } from '@/lib/projects'
import { MotionLink } from '@/components/motion/MotionProvider'
import { ease, fastTween } from '@/components/motion/presets'

const INTERVAL = 5000
const SQUEEZE = { duration: 0.6, ease: ease.inOut }

// 선택된 프로젝트만 넓게, 나머지는 거리만큼 좁은 띠로 눌린 캐러셀.
// 폭은 CSS가 --active·--dist·--hover로 계산하고, 그 값을 motion이 애니메이션한다
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
          {[
            { step: -1, label: '이전 프로젝트', Icon: IoIosArrowBack },
            { step: 1, label: '다음 프로젝트', Icon: IoIosArrowForward },
          ].map(({ step, label, Icon }) => (
            <motion.button
              key={label}
              type="button"
              onClick={() => go(step)}
              aria-label={label}
              whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              whileTap={{ scale: 0.92 }}
              transition={fastTween}
            >
              <Icon />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="squeeze-track">
        {projects.map((p, i) => {
          const isActive = i === active
          const dist = Math.abs(i - active)
          return (
            <motion.button
              key={p.id}
              type="button"
              className="squeeze-slide"
              data-active={isActive || undefined}
              style={{ '--active': isActive ? 1 : 0, '--dist': dist, '--hover': 0 } as React.CSSProperties}
              initial={false}
              animate={{ '--active': isActive ? 1 : 0, '--dist': dist, '--hover': 0 }}
              whileHover={isActive ? undefined : { '--hover': 1 }}
              transition={{ '--active': SQUEEZE, '--dist': SQUEEZE, '--hover': { duration: 0.3 } }}
              onClick={() => (isActive ? router.push(`/work/${p.slug}`) : setActive(i))}
              aria-label={isActive ? `${p.name} 자세히 보기` : `${p.name} 보기`}
              aria-current={isActive || undefined}
            >
              {p.image ? (
                <>
                  {/* 흐린 배경으로 여백을 채우고, 본 이미지는 잘리지 않게 contain */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="squeeze-img-bg" src={p.image} alt="" aria-hidden="true" loading={i === 0 ? 'eager' : 'lazy'} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="squeeze-img" src={p.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
                </>
              ) : (
                <span className="squeeze-fallback">{p.name.slice(0, 1)}</span>
              )}
              <motion.span
                className="squeeze-label"
                initial={false}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.3, delay: isActive ? 0.3 : 0 }}
              >
                {p.name}
              </motion.span>
            </motion.button>
          )
        })}
      </div>

      <div className="squeeze-caption" aria-live="polite">
        <p>
          <strong>{current.name}.</strong> {current.description}
        </p>
        <MotionLink
          href={`/work/${current.slug}`}
          className="squeeze-cta"
          whileHover={{ backgroundColor: 'var(--accent)' }}
          transition={fastTween}
        >
          자세히 보기 <IoIosArrowForward />
        </MotionLink>
      </div>
    </section>
  )
}
