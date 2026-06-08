import type { AboutVersion } from '@/components/about/AboutIntro'

/* ───────── Education ───────── */

export const education = [
  { period: '2023.03 ~', title: '한국외국어대학교(HUFS) 컴퓨터공학부' },
  { period: '2020.03 ~ 2023.01', title: '제주여자고등학교' },
]

/* ───────── Activities ───────── */

export const activities: { period: string; title: string; category: '개발' | 'PM' }[] = [
  { period: '2026.02 ~', title: 'University MakeUs Challenge 10기 PLAN 파트장', category: '개발' },
  { period: '2026.03 ~', title: '(주)Ulift 인턴', category: '개발' },
  { period: '2025', title: 'UMC X 한국외대 컴퓨터공학부 챌커톤 행사 운영', category: 'PM' },
  { period: '2025.08 ~ 2026.02', title: 'University MakeUs Challenge 9기 WEB 파트장', category: '개발' },
  { period: '2025.03 ~ 2025.12', title: 'N-CUBE 학회장', category: '개발' },
  { period: '2025.02 ~ 2025.12', title: '9oormthonUNIV 4기 한국외대 대표 / 6지부 대표', category: '개발' },
  { period: '2025', title: '구름톤 유니브 4기 데모데이 행사 운영', category: 'PM' },
  { period: '2024.09 ~ 2025.07', title: 'Google Developer Groups on HUFS 6기', category: '개발' },
  { period: '2024.09 ~ 2025.01', title: '9oormthonUNIV 3기 한국외대 부대표', category: '개발' },
  { period: '2024.01 ~ 2024.12', title: '멋쟁이사자처럼 12기 FE 트랙 운영진', category: '개발' },
  { period: '2024', title: '멋쟁이사자처럼 간지톤 행사 운영', category: '개발' },
  { period: '2023.03 ~ 2023.12', title: '멋쟁이사자처럼 11기 FE 트랙', category: '개발' },
  { period: '2023.03 ~ 2023.12', title: 'R-CUBE 학회원', category: '개발' },
  { period: '2023.11', title: '멋쟁이사자처럼 간지톤(미르톤) 대학연합해커톤 참가', category: '개발' },
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

