'use client'

import { HiDevicePhoneMobile, HiEnvelope, HiPencilSquare } from 'react-icons/hi2'
import { FiGithub } from 'react-icons/fi'
import AboutIntro, { type AboutVersion } from '@/components/about/AboutIntro'
import TypewriterText from '@/components/about/TypewriterText'
import TechStackGrid from '@/components/about/TechStackGrid'
import YearTimeline from '@/components/about/YearTimeline'
import PhilosophyList from '@/components/about/PhilosophyList'
import SectionReveal from '@/components/about/SectionReveal'
import {
  techStackByVersion,
  interestsByVersion,
  awards,
  education,
} from '@/app/about/[version]/data'
import type { Activity } from '@/lib/notion'

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  marginBottom: '0.75rem',
}

const philosophyByVersion: Record<AboutVersion, { who: string; cards: { title: string; desc: string }[] }> = {
  fe: {
    who: '단순히 기능을 구현하는 것을 넘어,\n사용자가 느끼는 \'경험\'을 고민합니다.',
    cards: [
      { title: 'Detail-Oriented', desc: '작은 어긋남과 미세한 지연도 실사용 관점에서는 불편으로 이어질 수 있다고 생각하며, 디테일을 점검하는 과정을 중요하게 여깁니다.' },
      { title: 'User-Centric', desc: '개발자의 편리함보다 사용자의 불편함을 먼저 고려합니다. 예쁜 코드보다 중요한 것은, 사용자가 불편함 없이 사용할 수 있는 화면입니다.' },
      { title: 'Continuous Growth', desc: '새로운 기술을 배우는 데 열린 태도를 가지고 있으며, 문제 해결에 도움이 되는 기술을 선별해 적용합니다.' },
    ],
  },
  be: {
    who: '단순히 동작하는 코드가 아닌,\n유지보수 가능한 구조를 고민합니다.',
    cards: [
      { title: 'Structure-First', desc: '기능보다 설계를 먼저 생각합니다. 잘 나뉜 레이어와 명확한 책임 분리가 장기적으로 더 빠른 개발을 만든다고 믿습니다.' },
      { title: 'Data-Driven', desc: '데이터 흐름과 일관성을 중요하게 여깁니다. API 설계부터 DB 스키마까지, 데이터가 어떻게 움직이는지를 먼저 그립니다.' },
      { title: 'Continuous Growth', desc: '백엔드 생태계는 넓습니다. CS 기초부터 인프라까지, 모르는 것을 인정하고 꾸준히 채워나가는 과정을 즐깁니다.' },
    ],
  },
  pm: {
    who: '개발과 기획 사이에서,\n두 언어를 모두 말할 수 있는 사람이 되고자 합니다.',
    cards: [
      { title: 'User-Centered Planning', desc: '기능 목록보다 사용자 여정을 먼저 그립니다. 왜 만드는지가 명확해야 무엇을 만들지가 보인다고 생각합니다.' },
      { title: 'Dev-Friendly Communication', desc: '직접 개발을 해봤기 때문에 구현 난이도와 공수를 체감할 수 있습니다. 개발자와 같은 언어로 소통하는 PM이 되고자 합니다.' },
      { title: 'Outcome Over Output', desc: '기능을 배포하는 것이 목표가 아닙니다. 그 기능이 실제로 문제를 해결했는지를 확인하는 것까지가 일이라고 생각합니다.' },
    ],
  },
}

export default function AboutVersionContent({
  version,
  activities,
}: {
  version: AboutVersion
  activities: Activity[]
}) {
  const isPM = version === 'pm'
  const techStack = techStackByVersion[version]
  const interests = interestsByVersion[version]
  const philosophy = philosophyByVersion[version]
  const versionActivities = isPM ? activities : activities.filter((a) => a.category.includes('개발'))

  return (
    <div>
      {/* 프로필 헤더 */}
      <SectionReveal style={{ marginBottom: '3rem' }}>
        <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img
            src="/profile.jpg"
            alt="프로필 사진"
            style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <h1 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.4rem' }}>
              <TypewriterText
                text={isPM
                  ? '안녕하세요, 개발과 기획 사이에서 다리를 놓는 PM 이예림입니다.'
                  : '안녕하세요, 결과로 신뢰를 만드는 개발자 이예림입니다.'}
              />
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              함께 일하기 좋은 개발자가 되기 위해 <strong>소통</strong>과 <strong>책임</strong>을 중요하게 생각합니다.<br />
              프로젝트 경험과 기술적 고민을 기록하고 있습니다.
            </p>
          </div>
        </div>
      </SectionReveal>

      <hr style={{ borderColor: 'var(--border)', marginBottom: '3rem' }} />

      <div>
        {/* About + 관심사 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
          <SectionReveal>
            <section id="about" style={{ scrollMarginTop: '100px' }}>
              <h2 style={sectionHeadingStyle}>About</h2>
              <AboutIntro version={version} />
            </section>
          </SectionReveal>
          <SectionReveal delay={100}>
            <section>
              <h2 style={sectionHeadingStyle}>관심사</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {interests.map((item) => (
                  <span key={item} className="tag-badge" style={{ fontSize: '0.85rem', padding: '5px 12px' }}>{item}</span>
                ))}
              </div>
            </section>
          </SectionReveal>
        </div>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

        {/* Philosophy */}
        <SectionReveal style={{ marginBottom: '3.5rem' }}>
          <section id="philosophy" style={{ scrollMarginTop: '100px' }}>
            <h2 style={sectionHeadingStyle}>Philosophy</h2>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              WHO I AM
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {philosophy.who.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>
            <PhilosophyList items={philosophy.cards} />
          </section>
        </SectionReveal>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

        {/* Awards */}
        <SectionReveal style={{ marginBottom: '3.5rem' }}>
          <section id="awards" style={{ scrollMarginTop: '100px' }}>
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
        </SectionReveal>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

        {/* Education */}
        <SectionReveal style={{ marginBottom: '3.5rem' }}>
          <section id="education" style={{ scrollMarginTop: '100px' }}>
            <h2 style={sectionHeadingStyle}>Education</h2>
            <div>
              {education.map((item, i) => (
                <div
                  key={i}
                  className="about-edu-row"
                  style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.1rem 0', borderBottom: i < education.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <span className="about-row-period" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingTop: '2px', minWidth: '130px' }}>{item.period}</span>
                  <span style={{ fontSize: '0.925rem', color: 'var(--text)', fontWeight: 500 }}>{item.title}</span>
                </div>
              ))}
            </div>
          </section>
        </SectionReveal>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

        {/* Activities */}
        <SectionReveal style={{ marginBottom: '3.5rem' }}>
          <section id="activities" style={{ scrollMarginTop: '100px' }}>
            <h2 style={sectionHeadingStyle}>Activities</h2>
            <YearTimeline
              items={versionActivities}
              getYear={(a) => a.period.slice(0, 4) || '기타'}
              renderItems={(items) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {items.map((item, ai) => (
                    <div
                      key={ai}
                      className="about-activity-row"
                      style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '0.7rem 0', borderBottom: ai < items.length - 1 ? '1px solid var(--border)' : 'none' }}
                    >
                      <span className="about-row-period" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingTop: '2px', minWidth: '120px' }}>{item.period}</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>{item.title}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </section>
        </SectionReveal>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

        {/* Tech Stack */}
        <SectionReveal style={{ marginBottom: '3.5rem' }}>
          <section id="stack" style={{ scrollMarginTop: '100px' }}>
            <h2 style={sectionHeadingStyle}>Tech Stack</h2>
            <TechStackGrid techStack={techStack} />
          </section>
        </SectionReveal>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

        {/* Contact */}
        <SectionReveal>
          <section id="contact" style={{ scrollMarginTop: '100px' }}>
            <h2 style={sectionHeadingStyle}>Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <HiDevicePhoneMobile style={{ fontSize: '1.1rem', color: 'var(--text-muted)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>010-2221-5418</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <HiEnvelope style={{ fontSize: '1.1rem', color: 'var(--text-muted)', flexShrink: 0 }} />
                <a href="mailto:fhddl1019@gmail.com" style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none' }}>fhddl1019@gmail.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FiGithub style={{ fontSize: '1.05rem', color: 'var(--text-muted)', flexShrink: 0 }} />
                <a href="https://github.com/yerimi00" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none' }}>github.com/yerimi00</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <HiPencilSquare style={{ fontSize: '1.1rem', color: 'var(--text-muted)', flexShrink: 0 }} />
                <a href="https://velog.io/@yerimi00" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none' }}>velog.io/@yerimi00</a>
              </div>
            </div>
          </section>
        </SectionReveal>
      </div>
    </div>
  )
}
