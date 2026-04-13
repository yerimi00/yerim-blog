import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AboutToc from '@/components/about/AboutToc'

export const metadata = { title: 'About', description: '안녕하세요, 예림입니다' }

/* ───────── 데이터 ───────── */

const education = [
  { period: '?? ~ 현재', title: '한국외국어대학교 컴퓨터공학부' },
  { period: '2024', title: '멋쟁이 사자처럼 12기' },
  { period: '2025.09 ~ 2026.02', title: 'UMC 9기 Web' },
]

type TechItem = { name: string; category: string; level: string; desc: string }
const techStack: TechItem[] = [
  { name: 'React', category: 'Library / Framework', level: '중상', desc: '컴포넌트 기반 UI를 구현하며 상태 관리, 라우팅, API 연동 등을 활용했습니다.' },
  { name: 'TypeScript', category: 'Language', level: '중상', desc: '타입 안정성을 높이고 코드 가독성과 유지보수성에 집중하고 있습니다.' },
  { name: 'Next.js', category: 'Library / Framework', level: '중', desc: 'App Router 기반 SSR/ISR 프로젝트 경험이 있습니다.' },
  { name: 'Spring Boot', category: 'Library / Framework', level: '중', desc: '백엔드 API 서버 구축에 사용하며 JPA, REST API 설계를 경험했습니다.' },
  { name: 'Git & GitHub', category: 'Collab', level: '상', desc: '브랜치 전략, PR 리뷰, 충돌 해결 등 협업 중심 워크플로우에 익숙합니다.' },
  { name: 'TailwindCSS', category: 'Styling', level: '중상', desc: '유틸리티 기반 스타일링으로 빠른 UI 개발을 경험했습니다.' },
]

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
  {
    name: '리얼매치',
    description: '브랜드·마이크로 인플루언서 매칭 및 협업 플랫폼',
    status: '진행중',
    period: '2025.09 ~ 현재',
    updatedAt: '2026.04',
    roles: ['BE', '팀원'],
  },
  {
    name: '루미클린',
    description: '[외주] 에어비앤비 청소 매칭 웹앱',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '팀원'],
  },
  {
    name: '넥스트 커리어',
    description: '중장년층의 숨은 경험을 자산으로 바꿔 맞춤 직업과 일자리를 제안하는 서비스',
    status: '완료',
    period: '2025.03 ~ 2025.05',
    updatedAt: '2025.05',
    roles: ['FE', '개발팀장'],
    award: '2025 kakao X 9oorm 시즌톤 최우수상',
  },
  {
    name: '스타트업 라이브러리',
    description: '창업 성공을 위한 맞춤형 도서 추천 플랫폼',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '팀원'],
  },
  {
    name: 'ComNCheck',
    description: '한국외국어대학교 컴퓨터공학부 알리미',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '기획', '디자인', '팀원'],
  },
  {
    name: '별자리',
    description: '스타(star)트업 자리 정보 별자리 서비스',
    status: '완료',
    period: '2024',
    updatedAt: '2024',
    roles: ['FE', '팀원'],
    award: '2024 취·창업 해커톤(HUFSTHON 2024) 최우수상',
  },
  {
    name: 'SODA',
    description: '오늘 하루 수고한 당신을 위한 AI 다이어리',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '기획', '디자인', '팀원'],
  },
  {
    name: 'HUFamilyS(한식구)',
    description: '한 사람의 건강 식품 공동구매 서비스',
    status: '완료',
    period: '2024.07',
    updatedAt: '2024.07',
    roles: ['FE', '기획', '디자인', 'PM', '개발팀장'],
    award: '2024 HUFSummer 해커톤 대상',
  },
  {
    name: 'Eating',
    description: '복학생, 신입생을 위한 학식 메이트 매칭 Platform',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '기획', '디자인', '팀원'],
  },
  {
    name: '졸업할 결심',
    description: '외대인의 졸업학점계산 서비스',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '디자인', '개발팀장'],
  },
  {
    name: 'HUFSLaundry',
    description: '기숙사 세탁기 알림 서비스',
    status: '완료',
    period: '2023.07',
    updatedAt: '2023.07',
    roles: ['FE', '기획', '디자인', '팀원'],
    award: '2023 HUFSummer 해커톤 우수상',
  },
]

/* ───────── 공통 스타일 ───────── */

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  marginBottom: '0.75rem',
}

/* ───────── 페이지 ───────── */

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem' }}>

        {/* 프로필 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            예
          </div>
          <div>
            <h1
              style={{
                fontFamily: 'Pretendard, sans-serif',
                fontSize: '1.7rem',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '0.4rem',
              }}
            >
              안녕하세요, 예림입니다 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              개발을 배우고, 배운 것을 기록합니다
            </p>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)', marginBottom: '3rem' }} />

        {/* 목차 + 전체 콘텐츠 그리드 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            gap: '3.5rem',
            alignItems: 'start',
          }}
        >
          {/* 좌측 sticky 목차 */}
          <aside style={{ position: 'sticky', top: '100px' }}>
            <AboutToc />
          </aside>

          {/* 우측 콘텐츠 */}
          <div>

            {/* ── About ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
              <section id="about" style={{ scrollMarginTop: '100px' }}>
                <h2 style={sectionHeadingStyle}>About</h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.8 }}>
                  현재 휴학 중으로 유리프트에서 실무를 경험하고 있어요. 개발, 기획, 운영을 넘나들며 배운 것들을 이 블로그에 솔직하게 기록하고 있습니다. 완벽하지 않아도, 배우는 중이라는 것 자체가 의미 있다고 생각해요.
                </p>
              </section>

              <section>
                <h2 style={sectionHeadingStyle}>관심사</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['백엔드 개발', 'Spring Boot', 'React', 'CS 공부', '기획', '교육'].map((item) => (
                    <span key={item} className="tag-badge" style={{ fontSize: '0.85rem', padding: '5px 12px' }}>
                      {item}
                    </span>
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
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
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
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'flex-start',
                      padding: '1.1rem 0',
                      borderBottom: i < education.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        paddingTop: '2px',
                        minWidth: '130px',
                      }}
                    >
                      {item.period}
                    </span>
                    <span style={{ fontSize: '0.925rem', color: 'var(--text)', fontWeight: 500 }}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

            {/* ── Tech Stack ── */}
            <section id="stack" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
              <h2 style={sectionHeadingStyle}>Tech Stack</h2>
              <div>
                {techStack.map((tech, i) => (
                  <div
                    key={tech.name}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '110px 60px 1fr',
                      gap: '1rem',
                      alignItems: 'center',
                      padding: '0.9rem 0',
                      borderBottom: i < techStack.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                      {tech.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: 'rgba(59,130,246,0.1)',
                        color: 'var(--accent)',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tech.level}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {tech.desc}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <hr style={{ borderColor: 'var(--border)', marginBottom: '3.5rem' }} />

            {/* ── Awards ── */}
            <section id="awards" style={{ scrollMarginTop: '100px', marginBottom: '3.5rem' }}>
              <h2 style={sectionHeadingStyle}>Awards</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {awards.map((award, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.85rem 1rem',
                      border: '1px solid rgba(251,191,36,0.25)',
                      borderRadius: '8px',
                      background: 'rgba(251,191,36,0.05)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#b45309',
                        background: 'rgba(251,191,36,0.15)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    >
                      {award.year}
                    </span>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                        {award.title}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        {award.project}
                      </p>
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
                {projects.map((project) => (
                  <div
                    key={project.name}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '1.25rem 1.5rem',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
                        {project.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '2px 10px',
                          borderRadius: '999px',
                          background: project.status === '진행중' ? 'rgba(59,130,246,0.12)' : 'rgba(107,114,128,0.12)',
                          color: project.status === '진행중' ? 'var(--accent)' : 'var(--text-muted)',
                          flexShrink: 0,
                        }}
                      >
                        {project.status}
                      </span>
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
                        <span
                          key={role}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            padding: '2px 9px',
                            borderRadius: '4px',
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
                      {project.description}
                    </p>

                    {project.award && (
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#b45309',
                          background: 'rgba(251,191,36,0.1)',
                          border: '1px solid rgba(251,191,36,0.3)',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          alignSelf: 'flex-start',
                        }}
                      >
                        🏆 {project.award}
                      </div>
                    )}

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--accent)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          alignSelf: 'flex-start',
                        }}
                      >
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
