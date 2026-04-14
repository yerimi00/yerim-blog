import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AboutToc from '@/components/about/AboutToc'
import AboutIntro, { type AboutVersion } from '@/components/about/AboutIntro'
import TypewriterText from '@/components/about/TypewriterText'
import TechStackGrid from '@/components/about/TechStackGrid'

export function generateStaticParams() {
  return [{ version: 'fe' }, { version: 'be' }, { version: 'pm' }]
}

export async function generateMetadata({ params }: { params: { version: string } }) {
  const labels: Record<string, string> = { fe: 'Frontend', be: 'Backend', pm: '기획자' }
  const label = labels[params.version]
  if (!label) return {}
  return { title: `About — ${label}`, description: '안녕하세요, 이예림입니다.' }
}

/* ───────── 데이터 ───────── */

const education = [
  { period: '2023 ~ 현재', title: '한국외국어대학교 컴퓨터공학부' },
  { period: '2023', title: '멋쟁이사자처럼 11기 FE 트랙' },
  { period: '2023', title: 'R-CUBE 학회원' },
  { period: '2023.07', title: '멋쟁이사자처럼 중앙 해커톤' },
  { period: '2023.07', title: '2023 HUFSummer Hackathon 우수상' },
  { period: '2023.11', title: '멋쟁이사자처럼 간지톤(미르톤)' },
  { period: '2024', title: '멋쟁이사자처럼 12기 FE 트랙 운영진' },
  { period: '2024.07', title: '2024 HUFSummer Hackathon 대상' },
  { period: '2024', title: '멋쟁이사자처럼 중앙 해커톤' },
  { period: '2024', title: '구름톤 유니브 3기 한국외대 부대표' },
  { period: '2024', title: 'HUFSTHON 2024 최우수상' },
  { period: '2024', title: '멋쟁이사자처럼 간지톤 운영진' },
  { period: '2024 ~ 현재', title: 'GDG on Campus Member' },
  { period: '2024', title: '모아[MO:A] PM' },
  { period: '2025', title: '구름톤 유니브 4기 한국외대 대표 / 6지부 대표' },
  { period: '2025', title: 'N-CUBE 학회장' },
  { period: '2025.09 ~ 2026.02', title: 'UMC 9기 Web' },
]

type TechItem = { name: string; group: string; level: string; desc: string; icon: string }
const techStackByVersion: Record<AboutVersion, TechItem[]> = {
  fe: [
    // FrontEnd
    { name: 'HTML5', group: 'FrontEnd', level: '상', desc: 'HTML5 시맨틱 마크업으로 구조적인 웹 문서를 작성합니다.', icon: 'html5' },
    { name: 'CSS3', group: 'FrontEnd', level: '상', desc: 'Flexbox, Grid, 애니메이션 등 다양한 CSS 기법을 활용합니다.', icon: 'css3' },
    { name: 'JavaScript', group: 'FrontEnd', level: '상', desc: 'ES6+ 문법과 비동기 처리 등 JS 핵심을 이해하고 사용합니다.', icon: 'javascript' },
    { name: 'TypeScript', group: 'FrontEnd', level: '중상', desc: '타입 안정성을 높이고 코드 가독성과 유지보수성에 집중하고 있습니다.', icon: 'typescript' },
    { name: 'React', group: 'FrontEnd', level: '중상', desc: '컴포넌트 기반 UI를 구현하며 상태 관리, 라우팅, API 연동 등을 활용했습니다.', icon: 'react' },
    { name: 'Next.js', group: 'FrontEnd', level: '중', desc: 'App Router 기반 SSR/ISR 프로젝트 경험이 있습니다.', icon: 'nextdotjs' },
    { name: 'Recoil', group: 'FrontEnd', level: '중', desc: 'Atom/Selector 패턴으로 React 전역 상태를 관리했습니다.', icon: 'recoil' },
    { name: 'Zustand', group: 'FrontEnd', level: '중', desc: '가볍고 직관적인 전역 상태 관리에 활용합니다.', icon: 'zustand' },
    { name: 'Jotai', group: 'FrontEnd', level: '초중', desc: 'Atomic 상태 관리 모델을 활용한 경량 상태 라이브러리입니다.', icon: 'jotai' },
    { name: 'TanStack Query', group: 'FrontEnd', level: '중', desc: '서버 상태 관리와 캐싱, 비동기 데이터 페칭에 활용합니다.', icon: 'reactquery' },
    { name: 'Styled Comp.', group: 'FrontEnd', level: '중', desc: 'CSS-in-JS로 컴포넌트 단위의 스코프 스타일링을 구현했습니다.', icon: 'styledcomponents' },
    { name: 'TailwindCSS', group: 'FrontEnd', level: '중상', desc: '유틸리티 기반 스타일링으로 빠른 UI 개발을 경험했습니다.', icon: 'tailwindcss' },
    // App
    { name: 'React Native', group: 'App', level: '초중', desc: 'React 기반 크로스플랫폼 모바일 앱 개발 경험이 있습니다.', icon: 'react' },
    { name: 'Flutter', group: 'App', level: '입문', desc: 'Dart 기반 크로스플랫폼 UI 프레임워크로 앱 개발을 경험했습니다.', icon: 'flutter' },
    // Collaboration & Tools
    { name: 'Figma', group: 'Collaboration & Tools', level: '중상', desc: '서비스 UI 설계, 와이어프레임, 프로토타입 제작에 활용합니다.', icon: 'figma' },
    { name: 'Slack', group: 'Collaboration & Tools', level: '상', desc: '팀 커뮤니케이션 도구로 채널 관리, 알림 연동 등을 활용합니다.', icon: 'slack' },
    { name: 'Discord', group: 'Collaboration & Tools', level: '상', desc: '개발 커뮤니티 및 팀 협업 채널로 활용합니다.', icon: 'discord' },
    { name: 'VS Code', group: 'Collaboration & Tools', level: '상', desc: '주력 코드 에디터로 다양한 익스텐션을 적극 활용합니다.', icon: 'visualstudiocode' },
    { name: 'IntelliJ', group: 'Collaboration & Tools', level: '중', desc: 'Java/Spring 개발 시 주로 사용하는 IDE입니다.', icon: 'intellijidea' },
    { name: 'Git', group: 'Collaboration & Tools', level: '상', desc: '버전 관리와 브랜치 전략으로 협업 워크플로우를 관리합니다.', icon: 'git' },
    { name: 'GitHub', group: 'Collaboration & Tools', level: '상', desc: 'PR 기반 코드 리뷰, 이슈 트래킹, Actions CI/CD를 활용합니다.', icon: 'github' },
    // Environment
    { name: 'Windows', group: 'Environment', level: '상', desc: '주로 사용하는 개발 환경입니다.', icon: 'windows11' },
    { name: 'macOS', group: 'Environment', level: '상', desc: '개인 프로젝트 및 블로그 작업에 활용하는 환경입니다.', icon: 'apple' },
  ],
  be: [
    // Backend
    { name: 'Spring Boot', group: 'Backend', level: '중', desc: 'RESTful API 설계 및 계층형·도메인형 아키텍처 구조를 익혀왔습니다.', icon: 'springboot' },
    { name: 'Java', group: 'Backend', level: '중', desc: '객체지향 설계 원칙을 이해하고 Spring 기반 개발에 활용하고 있습니다.', icon: 'openjdk' },
    { name: 'JPA', group: 'Backend', level: '초중', desc: '엔티티 설계, 연관관계 매핑, JPQL 쿼리 작성 경험이 있습니다.', icon: 'hibernate' },
    { name: 'MySQL', group: 'Backend', level: '초중', desc: 'ERD 모델링과 기본적인 SQL 쿼리 작성 및 최적화를 공부하고 있습니다.', icon: 'mysql' },
    // Collaboration & Tools
    { name: 'Git', group: 'Collaboration & Tools', level: '상', desc: '버전 관리와 브랜치 전략으로 협업 워크플로우를 관리합니다.', icon: 'git' },
    { name: 'GitHub', group: 'Collaboration & Tools', level: '상', desc: 'PR 기반 코드 리뷰, 이슈 트래킹, Actions CI/CD를 활용합니다.', icon: 'github' },
    { name: 'IntelliJ', group: 'Collaboration & Tools', level: '중', desc: 'Java/Spring 개발 시 주로 사용하는 IDE입니다.', icon: 'intellijidea' },
    { name: 'Slack', group: 'Collaboration & Tools', level: '상', desc: '팀 커뮤니케이션 도구로 채널 관리, 알림 연동 등을 활용합니다.', icon: 'slack' },
    // Environment
    { name: 'Windows', group: 'Environment', level: '상', desc: '주로 사용하는 개발 환경입니다.', icon: 'windows11' },
    { name: 'macOS', group: 'Environment', level: '상', desc: '개인 프로젝트 및 블로그 작업에 활용하는 환경입니다.', icon: 'apple' },
  ],
  pm: [
    // Design & Planning
    { name: 'Figma', group: 'Design & Planning', level: '중상', desc: '서비스 UI 설계, 와이어프레임, 프로토타입 제작에 활용합니다.', icon: 'figma' },
    { name: 'Notion', group: 'Design & Planning', level: '상', desc: '기획 문서, 스프린트 관리, 팀 위키 구성에 주로 사용합니다.', icon: 'notion' },
    // Tech 이해
    { name: 'React', group: 'Tech 이해', level: '중상', desc: '직접 개발 경험이 있어 프론트엔드 구현 난이도와 공수를 파악할 수 있습니다.', icon: 'react' },
    { name: 'Spring Boot', group: 'Tech 이해', level: '중', desc: '백엔드 구조를 이해해 개발자와 기술적 맥락에서 소통할 수 있습니다.', icon: 'springboot' },
    // Collaboration & Tools
    { name: 'GitHub', group: 'Collaboration & Tools', level: '중상', desc: '개발팀과 협업 시 이슈 트래킹 및 프로젝트 보드를 활용합니다.', icon: 'github' },
    { name: 'Slack', group: 'Collaboration & Tools', level: '상', desc: '팀 커뮤니케이션 도구로 채널 관리, 알림 연동 등을 활용합니다.', icon: 'slack' },
    { name: 'Discord', group: 'Collaboration & Tools', level: '상', desc: '개발 커뮤니티 및 팀 협업 채널로 활용합니다.', icon: 'discord' },
  ],
}

const interestsByVersion: Record<AboutVersion, string[]> = {
  fe: ['React', 'Next.js', 'TypeScript', 'UI/UX', '사용자 경험', '성능 최적화'],
  be: ['Spring Boot', 'RESTful API', 'DB 설계', 'CS 공부', '백엔드 아키텍처', '클린 코드'],
  pm: ['서비스 기획', 'UX 리서치', '팀 협업', '개발자와의 소통', '린 스타트업', '사용자 인터뷰'],
}

const awards = [
  { year: '2025', title: '2025 kakao X 9oorm 시즌톤 최우수상', project: '넥스트 커리어' },
  { year: '2024', title: '2024 취·창업 해커톤(HUFSTHON 2024) 최우수상', project: '별자리' },
  { year: '2024', title: '2024 HUFSummer 해커톤 대상', project: 'HUFamilyS(한식구)' },
  { year: '2023', title: '2023 HUFSummer 해커톤 우수상', project: 'HUFSLaundry' },
]

type Project = {
  name: string
  description: string
  status: '완료' | '진행중'
  period: string
  updatedAt: string
  roles: string[]
  award?: string
  github?: string
}

const projects: Project[] = [
  { name: '리얼매치', description: '브랜드·마이크로 인플루언서 매칭 및 협업 플랫폼', status: '진행중', period: '2025.09 ~ 현재', updatedAt: '2026.04', roles: ['BE', '팀원'] },
  { name: '루미클린', description: '[외주] 에어비앤비 청소 매칭 웹앱', status: '완료', period: '', updatedAt: '', roles: ['FE', '팀원'] },
  { name: '넥스트 커리어', description: '중장년층의 숨은 경험을 자산으로 바꿔 맞춤 직업과 일자리를 제안하는 서비스', status: '완료', period: '2025.03 ~ 2025.05', updatedAt: '2025.05', roles: ['FE', '개발팀장'], award: '2025 kakao X 9oorm 시즌톤 최우수상' },
  { name: '스타트업 라이브러리', description: '창업 성공을 위한 맞춤형 도서 추천 플랫폼', status: '완료', period: '', updatedAt: '', roles: ['FE', '팀원'] },
  { name: 'ComNCheck', description: '한국외국어대학교 컴퓨터공학부 알리미', status: '완료', period: '', updatedAt: '', roles: ['FE', '기획', '디자인', '팀원'] },
  { name: '별자리', description: '스타(star)트업 자리 정보 별자리 서비스', status: '완료', period: '2024', updatedAt: '2024', roles: ['FE', '팀원'], award: '2024 취·창업 해커톤(HUFSTHON 2024) 최우수상' },
  { name: 'SODA', description: '오늘 하루 수고한 당신을 위한 AI 다이어리', status: '완료', period: '', updatedAt: '', roles: ['FE', '기획', '디자인', '팀원'] },
  { name: 'HUFamilyS(한식구)', description: '한 사람의 건강 식품 공동구매 서비스', status: '완료', period: '2024.07', updatedAt: '2024.07', roles: ['FE', '기획', '디자인', 'PM', '개발팀장'], award: '2024 HUFSummer 해커톤 대상' },
  { name: 'Eating', description: '복학생, 신입생을 위한 학식 메이트 매칭 Platform', status: '완료', period: '', updatedAt: '', roles: ['FE', '기획', '디자인', '팀원'] },
  { name: '졸업할 결심', description: '외대인의 졸업학점계산 서비스', status: '완료', period: '', updatedAt: '', roles: ['FE', '디자인', '개발팀장'] },
  { name: 'HUFSLaundry', description: '기숙사 세탁기 알림 서비스', status: '완료', period: '2023.07', updatedAt: '2023.07', roles: ['FE', '기획', '디자인', '팀원'], award: '2023 HUFSummer 해커톤 우수상' },
]

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

  const techStack = techStackByVersion[version]
  const interests = interestsByVersion[version]

  const projectsByVersion: Record<AboutVersion, Project[]> = {
    fe: projects.filter((p) => p.roles.includes('FE')),
    be: projects.filter((p) => p.roles.includes('BE')),
    pm: projects.filter((p) => p.roles.some((r) => ['기획', 'PM'].includes(r))),
  }
  const versionProjects = projectsByVersion[version]

  return (
    <>
      <Header />
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem' }}>

        {/* 프로필 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <img
            src="/profile.jpg"
            alt="프로필 사진"
            style={{
              width: '110px', height: '110px', borderRadius: '50%',
              objectFit: 'cover', flexShrink: 0,
            }}
          />
          <div>
            <h1 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1.4rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.4rem' }}>
              <TypewriterText text="안녕하세요, 결과로 신뢰를 만드는 개발자 이예림입니다." />
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              개발을 배우고, 배운 것을 기록합니다
            </p>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '3rem' }} />

        {/* 목차 + 전체 콘텐츠 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '3.5rem', alignItems: 'start' }}>

          <aside style={{ position: 'sticky', top: '100px' }}>
            <AboutToc />
          </aside>

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

            {/* ── Education & Experience ── */}
            <section id="education" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
              <h2 style={sectionHeadingStyle}>Education &amp; Experience</h2>
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

            {/* ── Tech Stack ── */}
            <section id="stack" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
              <h2 style={sectionHeadingStyle}>Tech Stack</h2>
              <TechStackGrid techStack={techStack} />
            </section>

            <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

            {/* ── Awards ── */}
            <section id="awards" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
              <h2 style={sectionHeadingStyle}>Awards</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {awards.map((award, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '8px', background: 'rgba(251,191,36,0.05)' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b45309', background: 'rgba(251,191,36,0.15)', padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}>{award.year}</span>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{award.title}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{award.project}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

            {/* ── Project ── */}
            <section id="project" style={{ scrollMarginTop: '100px' }}>
              <h2 style={sectionHeadingStyle}>Project</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {versionProjects.map((project) => (
                  <div key={project.name} style={{ border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem 1.5rem', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>{project.name}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 10px', borderRadius: '999px', background: project.status === '진행중' ? 'rgba(59,130,246,0.12)' : 'rgba(107,114,128,0.12)', color: project.status === '진행중' ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }}>{project.status}</span>
                    </div>
                    {(project.period || project.updatedAt) && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem' }}>
                        {project.period && <span>{project.period}</span>}
                        {project.period && project.updatedAt && <span>·</span>}
                        {project.updatedAt && <span>최종 업데이트 {project.updatedAt}</span>}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {project.roles.map((role) => (
                        <span key={role} style={{ fontSize: '0.75rem', fontWeight: 500, padding: '2px 9px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{role}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>{project.description}</p>
                    {project.award && (
                      <div style={{ fontSize: '0.8rem', color: '#b45309', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '6px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', alignSelf: 'flex-start' }}>
                        🏆 {project.award}
                      </div>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', alignSelf: 'flex-start' }}>
                        GitHub →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
