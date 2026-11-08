import type { NotionProject } from '@/lib/projects'
import SectionReveal from '@/components/about/SectionReveal'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween, spring } from '@/components/motion/presets'
import { disciplinesOf, isLead } from '@/components/project/project-utils'

// 대표작 지면. 이미지 비율이 제각각이라 같은 크기의 매트 안에 잘리지 않게 넣고, 행마다 좌우를 바꾼다
export default function FeaturedWork({ projects }: { projects: NotionProject[] }) {
  return (
    <div className="work-featured">
      {projects.map((p, i) => (
        <SectionReveal key={p.slug}>
          <article className={`work-feature${i % 2 ? ' work-feature--flip' : ''}`}>
            <MotionLink
              href={`/work/${p.slug}`}
              className="work-feature-mat"
              aria-label={`${p.name} 자세히 보기`}
              whileHover={{ y: -6 }}
              transition={spring.soft}
            >
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
              ) : (
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)' }}>{p.name}</span>
              )}
            </MotionLink>

            <div>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 500, color: 'var(--accent)', margin: '0 0 0.6rem' }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)', margin: '0 0 0.6rem' }}>
                {p.name}
              </h3>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 1rem' }}>
                {p.overview || p.description}
              </p>
              <dl className="work-feature-meta">
                {p.period && (
                  <div>
                    <dt>기간</dt>
                    <dd>{p.period}</dd>
                  </div>
                )}
                <div>
                  <dt>역할</dt>
                  <dd>{disciplinesOf(p).join(' · ')}{isLead(p) && ' (팀장)'}</dd>
                </div>
              </dl>
              {p.award && (
                <p style={{ fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.5, color: 'var(--accent)', margin: '0.85rem 0 0' }}>
                  🏆 {p.award}
                </p>
              )}
              <MotionLink
                href={`/work/${p.slug}`}
                whileHover={{ x: 4, color: 'var(--accent)' }}
                transition={fastTween}
                style={{ display: 'inline-block', marginTop: '1.1rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}
              >
                자세히 보기 →
              </MotionLink>
            </div>
          </article>
        </SectionReveal>
      ))}
    </div>
  )
}
