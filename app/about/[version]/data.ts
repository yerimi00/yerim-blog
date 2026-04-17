import type { AboutVersion } from '@/components/about/AboutIntro'

/* ───────── Education ───────── */

export const education = [
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

/* ───────── Tech Stack ───────── */

export type TechItem = { name: string; group: string; level: string; desc: string; icon: string }

export const techStackByVersion: Record<AboutVersion, TechItem[]> = {
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

/* ───────── Interests ───────── */

export const interestsByVersion: Record<AboutVersion, string[]> = {
  fe: ['React', 'Next.js', 'TypeScript', 'UI/UX', '사용자 경험', '성능 최적화'],
  be: ['Spring Boot', 'RESTful API', 'DB 설계', 'CS 공부', '백엔드 아키텍처', '클린 코드'],
  pm: ['서비스 기획', 'UX 리서치', '팀 협업', '개발자와의 소통', '린 스타트업', '사용자 인터뷰'],
}

/* ───────── Awards ───────── */

export const awards = [
  { year: '2025', title: '🏆 2025 kakao X 9oorm 시즌톤 최우수상', project: '넥스트 커리어' },
  { year: '2024', title: '🏆 2024 취·창업 해커톤(HUFSTHON 2024) 최우수상', project: '별자리' },
  { year: '2024', title: '🏆 2024 HUFSummer 해커톤 대상 🥇', project: 'HUFamilyS(한식구)' },
  { year: '2023', title: '🏆 2023 HUFSummer 해커톤 우수상 🥉', project: 'HUFSLaundry' },
]

/* ───────── Projects ───────── */

export type Project = {
  name: string
  slug: string
  description: string
  overview?: string
  status: '완료' | '진행중'
  period: string
  updatedAt: string
  roles: string[]
  tech?: string[]
  responsibilities?: string[]
  problemSolving?: { title: string; body: string }[]
  award?: string
  github?: string
  url?: string
  image?: string
}

export const projects: Project[] = [
  {
    name: '리얼매치',
    slug: 'real-match',
    description: '브랜드·마이크로 인플루언서 매칭 및 협업 플랫폼',
    status: '진행중',
    period: '2025.09 ~ 현재',
    updatedAt: '2026.04',
    roles: ['BE', '팀원'],
    image: '/projects/real-match.png',
  },
  {
    name: '루미클린',
    slug: 'lumi-clean',
    description: '[외주] 에어비앤비 청소 매칭 웹앱',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '팀원'],
    image: '/projects/lumi-clean.png',
  },
  {
    name: '넥스트 커리어',
    slug: 'next-career',
    description: '중장년층의 숨은 경험을 자산으로 바꿔 맞춤 직업과 일자리를 제안하는 서비스',
    overview: '2025 kakao X 9oorm 시즌톤에서 최우수상을 수상한 프로젝트입니다. 중장년층이 자신의 경험을 정리하고, AI 기반 매칭을 통해 맞춤형 직업 정보와 일자리를 추천받을 수 있는 서비스를 Next.js App Router 기반으로 개발했습니다. 프론트엔드 개발팀장으로 아키텍처 설계부터 CI/CD 자동화, 성능 최적화까지 전반적인 프론트엔드 개발을 주도했습니다.',
    status: '완료',
    period: '2025.03 ~ 2025.05',
    updatedAt: '2025.05',
    roles: ['FE', '개발팀장'],
    tech: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Zustand', 'TanStack Query', 'Axios', 'Sentry', 'Google Analytics', 'PWA'],
    responsibilities: [
      'Axios Interceptor 및 중앙화된 인증 처리를 구현하여, JWT 토큰 자동 갱신 및 중복 코드 제거를 통한 유지보수성 향상',
      'Zustand 기반의 전역 상태 관리를 도입하여, 복잡한 커리어 로드맵 데이터의 흐름 제어 및 컴포넌트 간 불필요한 Props Drilling 방지',
      'Sentry를 활용한 실시간 에러 모니터링 시스템을 구축하여, 클라이언트/서버 런타임 오류 추적 및 네트워크 에러 클래스 분리를 통한 디버깅 효율화',
      'Google Analytics 및 Web Vitals를 적용하여, 사용자 행동 데이터 수집 및 LCP/CLS 등 핵심 성능 지표 측정을 통한 UX 개선 근거 마련',
      'GitHub Actions와 Docker를 활용한 CI/CD 자동화 파이프라인 구축 및 Husky를 통한 커밋 전 코드 품질(Lint) 검사 자동화',
      'PWA(Service Worker, Manifest) 및 Lottie 애니메이션을 도입하여, 모바일 앱과 유사한 설치 환경 제공 및 동적 인터랙션을 통한 사용자 몰입감 증대',
    ],
    problemSolving: [
      {
        title: 'JWT 토큰 만료 시 API 요청 중단 문제',
        body: 'Axios Interceptor에서 401 응답을 감지하면 자동으로 토큰을 갱신하고, 갱신 중 발생한 동시 요청들을 큐에 쌓아 순차적으로 재전송하는 방식으로 해결했습니다. 이를 통해 사용자가 로그인 만료를 인식하지 못하고 자연스럽게 서비스를 이용할 수 있게 되었습니다.',
      },
      {
        title: '복잡한 커리어 로드맵 상태 관리',
        body: '여러 단계에 걸친 커리어 로드맵 데이터가 컴포넌트 간 깊게 공유되어 Props Drilling이 심각했습니다. Zustand로 전역 스토어를 구성하고 슬라이스 패턴으로 도메인별로 상태를 분리하여 가독성과 유지보수성을 개선했습니다.',
      },
    ],
    award: '2025 kakao X 9oorm 시즌톤 최우수상',
    url: 'https://www.next-career.co.kr/',
    image: '/projects/next-career.png',
  },
  {
    name: '스타트업 라이브러리',
    slug: 'startup-library',
    description: '창업 성공을 위한 맞춤형 도서 추천 플랫폼',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '팀원'],
    image: '/projects/startup-library.png',
  },
  {
    name: 'ComNCheck',
    slug: 'comncheck',
    description: '한국외국어대학교 컴퓨터공학부 알리미',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '기획', '디자인', '팀원'],
    url: 'https://www.comncheck.com/',
    image: '/projects/comncheck.png',
  },
  {
    name: '별자리',
    slug: 'byeoljari',
    description: '스타(star)트업 자리 정보 별자리 서비스',
    status: '완료',
    period: '2024',
    updatedAt: '2024',
    roles: ['FE', '팀원'],
    award: '2024 취·창업 해커톤(HUFSTHON 2024) 최우수상',
    image: '/projects/byeoljari.png',
  },
  {
    name: 'SODA',
    slug: 'soda',
    description: '오늘 하루 수고한 당신을 위한 AI 다이어리',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '기획', '디자인', '팀원'],
    image: '/projects/soda.png',
  },
  {
    name: 'HUFamilyS(한식구)',
    slug: 'hufamilys',
    description: '한 사람의 건강 식품 공동구매 서비스',
    status: '완료',
    period: '2024.07',
    updatedAt: '2024.07',
    roles: ['FE', '기획', '디자인', 'PM', '개발팀장'],
    award: '2024 HUFSummer 해커톤 대상',
    image: '/projects/hufamilys.png',
  },
  {
    name: 'Eating',
    slug: 'eating',
    description: '복학생, 신입생을 위한 학식 메이트 매칭 Platform',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '기획', '디자인', '팀원'],
    image: '/projects/eating.png',
  },
  {
    name: '졸업할 결심',
    slug: 'graduation',
    description: '외대인의 졸업학점계산 서비스',
    status: '완료',
    period: '',
    updatedAt: '',
    roles: ['FE', '디자인', '개발팀장'],
    image: '/projects/graduation.png',
  },
  {
    name: 'HUFSLaundry',
    slug: 'hufs-laundry',
    description: '기숙사 세탁기 알림 서비스',
    status: '완료',
    period: '2023.07',
    updatedAt: '2023.07',
    roles: ['FE', '기획', '디자인', '팀원'],
    award: '2023 HUFSummer 해커톤 우수상',
    image: '/projects/hufs-laundry.png',
  },
]
