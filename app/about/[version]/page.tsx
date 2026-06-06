import { notFound } from 'next/navigation'
import { IoIosArrowForward } from 'react-icons/io'
import { HiDevicePhoneMobile, HiEnvelope, HiPencilSquare } from 'react-icons/hi2'
import { FiGithub } from 'react-icons/fi'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileFooterLinks from '@/components/layout/MobileFooterLinks'
import AboutIntro, { type AboutVersion } from '@/components/about/AboutIntro'
import TypewriterText from '@/components/about/TypewriterText'
import TechStackGrid from '@/components/about/TechStackGrid'
import AboutToc from '@/components/about/AboutToc'
import YearTimeline from '@/components/about/YearTimeline'
import {
  techStackByVersion,
  interestsByVersion,
  awards,
  education,
  activities,
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

          </div>

          <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

          {/* ── Philosophy ── */}
          <section id="philosophy" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
            <h2 style={sectionHeadingStyle}>Philosophy</h2>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              WHO I AM
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text)', lineHeight: 1.7, marginBottom: '2rem' }}>
              단순히 기능을 구현하는 것을 넘어,<br />
              사용자가 느끼는 &apos;경험&apos;을 고민합니다.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  title: 'Detail-Oriented',
                  desc: '작은 어긋남과 미세한 지연도 실사용 관점에서는 불편으로 이어질 수 있다고 생각하며, 디테일을 점검하는 과정을 중요하게 여깁니다.',
                },
                {
                  title: 'User-Centric',
                  desc: '개발자의 편리함보다 사용자의 불편함을 먼저 고려합니다. 예쁜 코드보다 중요한 것은, 사용자가 불편함 없이 사용할 수 있는 화면입니다.',
                },
                {
                  title: 'Continuous Growth',
                  desc: '새로운 기술을 배우는 데 열린 태도를 가지고 있으며, 문제 해결에 도움이 되는 기술을 선별해 적용합니다.',
                },
              ].map(({ title, desc }) => (
                <div key={title} style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--surface-container)',
                  borderLeft: '3px solid var(--accent)',
                }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>{title}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
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

          {/* ── Education ── */}
          <section id="education" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
            <h2 style={sectionHeadingStyle}>Education</h2>
            <div>
              {education.map((item, i) => (
                <div key={i} className="about-edu-row" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.1rem 0', borderBottom: i < education.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span className="about-row-period" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingTop: '2px', minWidth: '130px' }}>{item.period}</span>
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
                    <div key={ai} className="about-activity-row" style={{
                      display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                      padding: '0.7rem 0',
                      borderBottom: ai < items.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <span className="about-row-period" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingTop: '2px', minWidth: '120px' }}>{item.period}</span>
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

          {/* ── Contact ── */}
          <section id="contact" style={{ scrollMarginTop: '100px' }}>
            <h2 style={sectionHeadingStyle}>Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <HiDevicePhoneMobile style={{ fontSize: '1.1rem', color: 'var(--text-muted)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>010-2221-5418</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <HiEnvelope style={{ fontSize: '1.1rem', color: 'var(--text-muted)', flexShrink: 0 }} />
                <a href="mailto:fhddl1019@gmail.com" style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none' }}>
                  fhddl1019@gmail.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FiGithub style={{ fontSize: '1.05rem', color: 'var(--text-muted)', flexShrink: 0 }} />
                <a href="https://github.com/yerimi00" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none' }}>
                  github.com/yerimi00
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <HiPencilSquare style={{ fontSize: '1.1rem', color: 'var(--text-muted)', flexShrink: 0 }} />
                <a href="https://velog.io/@yerimi00" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none' }}>
                  velog.io/@yerimi00
                </a>
              </div>
            </div>
          </section>

        </div>

        <MobileFooterLinks />

      </main>
      <Footer />
    </>
  )
}
