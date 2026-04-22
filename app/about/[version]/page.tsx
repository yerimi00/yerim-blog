import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AboutIntro, { type AboutVersion } from '@/components/about/AboutIntro'
import TypewriterText from '@/components/about/TypewriterText'
import TechStackGrid from '@/components/about/TechStackGrid'
import ProjectList from '@/components/about/ProjectList'
import AboutToc from '@/components/about/AboutToc'
import YearTimeline from '@/components/about/YearTimeline'
import {
  techStackByVersion,
  interestsByVersion,
  awards,
  education,
  activities,
  projects,
} from './data'

export function generateStaticParams() {
  return [{ version: 'fe' }, { version: 'be' }, { version: 'pm' }]
}

export async function generateMetadata({ params }: { params: { version: string } }) {
  const labels: Record<string, string> = { fe: 'Frontend', be: 'Backend', pm: '기획자' }
  const label = labels[params.version]
  if (!label) return {}
  return { title: `About — ${label}`, description: '안녕하세요, 이예림입니다.' }
}

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  marginBottom: '0.75rem',
}

/* ───────── 페이지 ───────── */

export default function AboutVersionPage({ params }: { params: { version: string } }) {
  const VALID = ['fe', 'be', 'pm']
  if (!VALID.includes(params.version)) notFound()
  const version = params.version as AboutVersion
  const isPM = version === 'pm'

  const techStack = techStackByVersion[version]
  const interests = interestsByVersion[version]

  const versionActivities = isPM
    ? activities
    : activities.filter((a) => a.category === '개발')

  const versionProjects = isPM
    ? projects.filter((p) => p.roles.some((r) => ['기획', 'PM'].includes(r)))
    : projects.filter((p) => p.roles.includes(version.toUpperCase() as 'FE' | 'BE'))

  return (
    <>
      <Header />
      <AboutToc />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem' }}>

        {/* 프로필 헤더 */}
        <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <img
            src="/profile.jpg"
            alt="프로필 사진"
            style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <h1 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.4rem' }}>
              <TypewriterText text={isPM ? '안녕하세요, 개발과 기획 사이에서 다리를 놓는 PM 이예림입니다.' : '안녕하세요, 결과로 신뢰를 만드는 개발자 이예림입니다.'} />
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              개발을 배우고, 배운 것을 기록합니다
            </p>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '3rem' }} />

        <div>

          {/* ── About ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
            <section id="about" style={{ scrollMarginTop: '100px' }}>
              <h2 style={sectionHeadingStyle}>About</h2>
              <AboutIntro version={version} />
            </section>

            <section>
              <h2 style={sectionHeadingStyle}>관심사</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {interests.map((item) => (
                  <span key={item} className="tag-badge" style={{ fontSize: '0.85rem', padding: '5px 12px' }}>{item}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 style={sectionHeadingStyle}>링크</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { label: 'GitHub', url: 'https://github.com/yerimi00' },
                  { label: 'Velog', url: 'https://velog.io/@yerimi00' },
                ].map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {label} →
                  </a>
                ))}
              </div>
            </section>
          </div>

          <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

          {/* ── Education ── */}
          <section id="education" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
            <h2 style={sectionHeadingStyle}>Education</h2>
            <div>
              {education.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.1rem 0', borderBottom: i < education.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingTop: '2px', minWidth: '130px' }}>{item.period}</span>
                  <span style={{ fontSize: '0.925rem', color: 'var(--text)', fontWeight: 500 }}>{item.title}</span>
                </div>
              ))}
            </div>
          </section>

          <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

          {/* ── Activities ── */}
          <section id="activities" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
            <h2 style={sectionHeadingStyle}>Activities</h2>
            <YearTimeline
              items={versionActivities}
              getYear={(a) => a.period.slice(0, 4) || '기타'}
              renderItems={(items) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {items.map((item, ai) => (
                    <div key={ai} style={{
                      display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                      padding: '0.7rem 0',
                      borderBottom: ai < items.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingTop: '2px', minWidth: '120px' }}>{item.period}</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>{item.title}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </section>

          <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

          {/* ── Tech Stack ── */}
          <section id="stack" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
            <h2 style={sectionHeadingStyle}>Tech Stack</h2>
            <TechStackGrid techStack={techStack} />
          </section>

          <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

          {/* ── Awards ── */}
          <section id="awards" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
            <h2 style={sectionHeadingStyle}>Awards</h2>
            <YearTimeline
              items={awards}
              getYear={(a) => a.year}
              renderItems={(items) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {items.map((award, ai) => (
                    <div key={ai}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{award.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{award.project}</p>
                    </div>
                  ))}
                </div>
              )}
            />
          </section>

          <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

          {/* ── Project ── */}
          <section id="project" style={{ scrollMarginTop: '100px' }}>
            <h2 style={{ ...sectionHeadingStyle, marginBottom: '0.75rem' }}>Project</h2>
            <ProjectList projects={versionProjects} />
          </section>

        </div>

      </main>
      <Footer />
    </>
  )
}
