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
  problemSolving?: {
    title: string
    body?: string
    problem?: string
    cause?: string
    solution?: string
    result?: string
    code?: Array<{ filename: string; content: string }>
  }[]
  award?: string
  github?: string
  url?: string
  image?: string
  intro?: string
  conclusion?: string
  relatedPosts?: string[]
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
    intro: '이 글은 2025 SEASONTHON TEAM 42 프론트엔드 프로젝트에서 직접 구현한 6가지 기술적 의사결정을 코드베이스 수치와 함께 정리한 회고입니다.',
    problemSolving: [
      {
        title: '1. Axios Interceptor & 중앙화된 인증 처리',
        problem: '각 API 호출 함수마다 Authorization: Bearer ${token} 헤더 설정과 401 처리 로직이 중복 작성되고 있었다. jobApi.ts 단일 파일만 해도 1,177줄에 달했고, 에러 처리 보일러플레이트가 반복되었다. 설상가상으로 동시에 여러 요청이 401을 받을 경우 refresh 요청이 중복 발생하는 Race Condition이 발생했다. 예를 들어 페이지 진입 시 3개의 API가 동시에 호출되면, 3개가 모두 401을 받아 각자 refresh를 시도하는 상황이 생긴다.',
        cause: '초기 구조에서 각 기능별로 개별 fetch() 호출 방식을 사용했기 때문에, 토큰 갱신 로직이 각 API 파일에 분산되었다. 공통 요청/응답 처리 레이어가 없으니 인증 코드를 파일마다 복붙할 수밖에 없었고, 토큰 만료 시 어느 요청이 실패했는지 추적도 어려웠다.',
        solution: 'src/lib/api/axios.ts에 Axios 인터셉터 기반 인스턴스를 구성했다. 핵심은 refreshPromise 변수를 이용한 deduplicate 패턴이다. 여러 요청이 동시에 401을 받아도 실제 refresh 요청은 단 1번만 실행되고, 나머지는 같은 Promise를 기다린다. fetch() 기반 코드와의 호환성을 위해 fetchWithAuth.ts에도 동일 패턴을 구현했다.',
        result: '인증 처리 코드가 2개 파일(axios.ts 101줄, fetchWithAuth.ts 113줄)로 완전 통합되었다. 프로젝트 전체에서 axiosInstance/fetchWithAuth 사용 호출이 33곳으로, 기존 각 파일에 흩어져 있던 중복 401 처리 분기문이 모두 제거되었다. 신규 API 추가 시 인증 코드 없이 엔드포인트만 작성하면 된다.',
        code: [
          {
            filename: 'src/lib/api/axios.ts',
            content: `import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// refresh 중복 방지 - 여러 요청이 동시에 401을 받아도 refresh는 1번만 실행
let refreshPromise: Promise<void> | null = null;

export const axiosInstance = axios.create({ baseURL: '', withCredentials: true });

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;
    if (!error.response) return Promise.reject(error);

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 재시도 방지

      if (!refreshPromise) {
        refreshPromise = fetch('/api/auth/refresh-tokens', {
          method: 'POST',
          credentials: 'include',
        })
          .then((res) => { if (!res.ok) throw new Error('Token refresh failed'); })
          .catch((err) => {
            if (typeof window !== 'undefined') {
              if (!window.location.pathname.startsWith('/ai-chat/'))
                window.location.href = '/';
            }
            throw err;
          })
          .finally(() => { refreshPromise = null; }); // 완료 후 초기화
      }

      await refreshPromise;
      return axiosInstance(originalRequest); // 원래 요청 재시도
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),
  // ... put, delete, patch
};`,
          },
          {
            filename: 'src/lib/api/fetchWithAuth.ts',
            content: `let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/refresh-tokens', {
      method: 'POST', credentials: 'include',
    });
    const result = await res.json();
    return result.result === 'SUCCESS';
  } catch { return false; }
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit & { skipRefresh?: boolean } = {}
): Promise<Response> {
  const { skipRefresh = false, ...fetchOptions } = options;
  const requestOptions = { ...fetchOptions, credentials: 'include' as const };

  let response = await fetch(url, requestOptions);
  if (response.status !== 401 || skipRefresh) return response;

  // 동시 401 처리 deduplicate
  if (isRefreshing && refreshPromise) {
    const success = await refreshPromise;
    return success ? fetch(url, requestOptions) : response;
  }

  isRefreshing = true;
  refreshPromise = refreshTokens();
  try {
    const refreshSuccess = await refreshPromise;
    if (refreshSuccess) response = await fetch(url, requestOptions);
    return response;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}`,
          },
        ],
      },
      {
        title: '2. Zustand 기반 전역 상태 관리',
        problem: '커리어 로드맵 페이지에서 "로드맵 생성 여부(hasRoadmap)" 상태를 Header, CareerRoadmapSection, AICoachRoadmapSection 등 여러 컴포넌트가 공통으로 참조해야 했다. 그런데 상위 컴포넌트에서 props로 내려보내는 구조로 3단계 이상의 Prop Drilling이 발생했다.',
        cause: 'Next.js App Router 환경에서 Server Component와 Client Component가 혼재하고, 페이지 단위 레이아웃 분리로 인해 공통 부모에서 상태를 관리하기 어려운 구조였다. React Context API는 Provider 위치 제약으로 App Router에서 적용이 복잡했다.',
        solution: 'src/stores/roadmapStore.ts에 Zustand store를 구성했다. Zustand는 Provider 래핑 없이 동작하므로 App Router 구조에 그대로 적합하다.',
        result: '로드맵 상태 관련 Props 전달 체인이 완전히 제거되었다. useRoadmapStore를 사용하는 컴포넌트들이 각자 독립적으로 상태를 구독하게 되어, 상태 변경 시 관련 컴포넌트만 선택적으로 리렌더링된다. Redux 대비 보일러플레이트 코드가 적어 빠르게 적용할 수 있었다.',
        code: [
          {
            filename: 'src/stores/roadmapStore.ts',
            content: `import { create } from 'zustand';

interface RoadmapState {
  hasRoadmap: boolean;
  setHasRoadmap: (hasRoadmap: boolean) => void;
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  hasRoadmap: true,
  setHasRoadmap: (hasRoadmap) => set({ hasRoadmap }),
}));

// 컴포넌트에서 사용 - props 없이 어디서든 1줄로 구독
function CareerRoadmapSection() {
  const { hasRoadmap, setHasRoadmap } = useRoadmapStore();
  // ...
}`,
          },
        ],
      },
      {
        title: '3. Sentry 에러 모니터링',
        problem: '프로덕션 환경에서 발생하는 런타임 에러를 재현하기 어려웠다. 특히 네트워크 요청 실패 에러들이 Sentry에 "Network Error"로만 기록되어, "어느 엔드포인트에서, 어떤 HTTP 상태로 실패했는지" 구분이 불가능했다.',
        cause: 'Axios 에러는 error.message가 "Network Error"처럼 추상화된 문자열로 동일하게 표시된다. Sentry 이슈 목록에서 서로 다른 API 실패들이 하나의 이슈로 묶이게 되어 우선순위 파악이 불가능했다. 클라이언트/서버/엣지 환경별 설정도 분리되지 않았다.',
        solution: 'src/lib/sentry/SentryNetworkError.ts에 커스텀 에러 클래스를 구현했다. "[401 Error] - /api/auth/user" 형태로 HTTP 상태 코드와 경로를 에러 이름에 포함시키고, URL 경로의 동적 파라미터(/123/)를 /{id}/로 정규화해 같은 종류의 에러가 1개 이슈로 집계되도록 처리했다. Sentry 설정은 client/server/edge 3개 환경으로 분리하고, tracesSampleRate: 1.0으로 전수 추적을 설정했다.',
        result: '네트워크 에러가 엔드포인트 + 상태코드 조합으로 분류되어 동일 에러를 빠르게 식별할 수 있게 되었다. Web Vitals(CLS, FCP, LCP, TTFB, INP) 5개 지표를 Sentry.setMeasurement로 자동 전송해, 성능 이슈와 에러를 같은 대시보드에서 연계 분석할 수 있게 되었다.',
        code: [
          {
            filename: 'src/lib/sentry/SentryNetworkError.ts',
            content: `export class SentryNetworkError extends Error {
  name: string;

  private static generateName(error: AxiosLikeError): string {
    const status =
      (error.response && (error.response as { status?: number }).status) || 'Unknown';
    const baseURL = (error.config && (error.config as { baseURL?: string }).baseURL) || '';
    const url = (error.config && (error.config as { url?: string }).url) || '';
    const path = String(url).split('?')[0];
    // /user/123/profile → /user/{id}/profile 로 정규화
    const replacePathParams = path.replace(/\\/\\d+(?=\\/|$)/g, '/{id}');
    return \`[\${status} Error] - \${baseURL}\${replacePathParams}\`;
  }

  constructor(error: AxiosLikeError) {
    super(error.message || 'Network Error');
    this.name = SentryNetworkError.generateName(error);
    Object.setPrototypeOf(this, SentryNetworkError.prototype);
  }
}`,
          },
          {
            filename: 'sentry.client.config.ts',
            content: `import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0, // 전수 추적
});

// Web Vitals를 Sentry에 함께 전송
if (typeof window !== 'undefined') {
  import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
    const handleMetric = (metric: { name: string; value: number }) => {
      Sentry.setMeasurement(metric.name, metric.value, 'millisecond');
      Sentry.setContext('web-vitals', metric);
    };
    onCLS(handleMetric); onFCP(handleMetric); onLCP(handleMetric);
    onTTFB(handleMetric); onINP(handleMetric);
  });
}`,
          },
        ],
      },
      {
        title: '4. Google Analytics & Web Vitals',
        problem: '서비스 기획 개선 시 "실제 사용자가 어떤 페이지에서 이탈하는지", "로딩이 느리다고 느끼는 구간이 어디인지"에 대한 데이터 없이 주관적 판단에 의존하고 있었다. PWA 환경에서 모바일 접속 비중이 높을 것으로 예상되었으나, 실제 디바이스별 성능 편차를 측정할 수단이 없었다.',
        cause: '별도의 사용자 행동 수집 도구가 미도입 상태였다. 특히 Core Web Vitals 지표를 실사용자 기준으로 수집하는 RUM(Real User Monitoring) 파이프라인이 없었다.',
        solution: 'src/app/layout.tsx에 NEXT_PUBLIC_GA_MEASUREMENT_ID 환경변수 기반으로 GA4 스크립트를 조건부 삽입했다. WebVitals.tsx 컴포넌트에서 web-vitals 라이브러리의 5개 메트릭을 수집해 Sentry로 동시 전송한다. 환경변수가 없으면 스크립트 미삽입으로 개발 환경 오염을 방지했다.',
        result: 'LCP(최대 콘텐츠 렌더링), CLS(누적 레이아웃 이동), INP(다음 페인트까지 상호작용) 등 Core Web Vitals 5개 지표를 실사용자 기준으로 수집하게 되었다. 페이지뷰·이벤트 데이터(GA4)와 성능 지표(Sentry)를 연계해 UX 개선 우선순위를 데이터 기반으로 결정할 수 있게 되었다.',
        code: [
          {
            filename: 'src/app/_components/WebVitals.tsx',
            content: `'use client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export function WebVitals() {
  useEffect(() => {
    const reportWebVitals = async () => {
      const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
      const handleMetric = (metric: { name: string; value: number }) => {
        Sentry.setMeasurement(metric.name, metric.value, 'millisecond');
        Sentry.setContext('web-vitals', metric);
        if (process.env.NODE_ENV === 'development')
          console.log(\`[Web Vitals] \${metric.name}:\`, metric);
      };
      onCLS(handleMetric); onFCP(handleMetric); onLCP(handleMetric);
      onTTFB(handleMetric); onINP(handleMetric);
    };
    reportWebVitals();
  }, []);
  return null; // UI 없는 측정 전용 컴포넌트
}`,
          },
          {
            filename: 'src/app/layout.tsx',
            content: `const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// GA_ID가 있을 때만 스크립트 삽입 (개발 환경 오염 방지)
{gaId && (
  <>
    <script async src={\`https://www.googletagmanager.com/gtag/js?id=\${gaId}\`} />
    <script dangerouslySetInnerHTML={{ __html: \`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '\${gaId}');
    \` }} />
  </>
)}
{/* LCP 대상 이미지 preload */}
<link rel="preload" href="/assets/Icons/character_hi.webp" as="image" type="image/webp" />`,
          },
        ],
      },
      {
        title: '5. CI/CD 자동화 & Husky',
        problem: '팀 협업 시 개인 로컬 환경에 따라 lint 미통과 코드가 main 브랜치에 머지되거나, 배포 전 수동 빌드 검증 누락으로 런타임 오류가 프로덕션에 유입되는 사례가 발생했다.',
        cause: '코드 품질 검사와 빌드 검증이 개발자 재량에 맡겨져 있고, 배포 프로세스가 자동화되지 않아 휴먼 에러 개입 가능성이 높았다.',
        solution: '.github/workflows/ci.yml에 main·develop 브랜치 push/PR 시 ESLint → Prettier → TypeScript 타입 체크 → Next.js 빌드 4단계 파이프라인을 구성했다. Husky pre-commit 훅에 lint-staged를 연결해 커밋 대상 파일에만 ESLint + Prettier를 선택적으로 실행했다.',
        result: 'PR 머지 전 코드 품질 게이트가 자동 적용된다. Husky로 인해 커밋 단계에서 lint 에러가 있으면 커밋 자체가 차단되어 "lint는 나중에"로 미루는 습관을 방지했다. 전체 파일 대신 변경 파일만 검사하므로 pre-commit 실행 시간이 최소화된다.',
        code: [
          {
            filename: '.github/workflows/ci.yml',
            content: `name: CI
on:
  push:    { branches: [main, develop] }
  pull_request: { branches: [main, develop] }

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20.x, cache: 'npm' }
      - run: npm ci
      - run: npm run lint          # ESLint
      - run: npx prettier --check . # Prettier
      - run: npx tsc --noEmit       # TypeScript 타입 체크

  build:
    needs: lint-and-type-check      # lint 통과 후에만 빌드
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20.x, cache: 'npm' }
      - run: npm ci && npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-files-\${{ github.sha }}
          path: .next/
          retention-days: 7`,
          },
          {
            filename: 'package.json (lint-staged)',
            content: `// package.json
{
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "**/*.{json,css,md}": ["prettier --write"]
  }
}

// .husky/pre-commit
// npx lint-staged`,
          },
        ],
      },
      {
        title: '6. PWA & Lottie 애니메이션',
        problem: '서비스 대상인 중장년층은 앱 설치에 익숙하고 웹 브라우저 재방문율이 낮다. 또한 단순 페이지 전환 시 시각적 피드백이 없어 로딩 중 사용자가 이탈하거나 중복 탭을 다시 시도하는 패턴이 발생했다.',
        cause: '일반 웹사이트로 배포되어 홈 화면 추가·오프라인 캐싱 등의 네이티브 앱 경험을 제공할 수 없었다. 로딩/전환 구간에 정적 스피너만 사용해 사용자 주의를 붙잡을 동적 요소가 부재했다.',
        solution: 'next-pwa + Service Worker + manifest.json으로 PWA를 설정했다. 개발 환경에서는 자동 비활성화된다. @lottiefiles/dotlottie-react로 AI 채팅, 로드맵 완성 등 주요 인터랙션 구간에 Lottie 애니메이션을 적용했다. iOS 독립 실행 모드 지원을 위한 메타태그도 layout.tsx에 추가했다.',
        result: '홈 화면 추가(Add to Home Screen) 및 iOS Safari 독립 실행 모드(apple-mobile-web-app-capable) 지원으로, 중장년 사용자에게 앱과 동일한 진입 경험을 제공할 수 있게 되었다. Service Worker 캐싱으로 반복 방문 시 정적 자산 네트워크 요청이 감소하고, 핵심 이미지 preload 적용으로 초기 로딩 시 LCP 개선 효과를 기대할 수 있다.',
        code: [
          {
            filename: 'next.config.ts',
            content: `const withPWA = require('next-pwa')({
  dest: 'public',      // sw.js, workbox 파일 생성 위치
  register: true,      // Service Worker 자동 등록
  skipWaiting: true,   // 새 SW 즉시 활성화
  disable: process.env.NODE_ENV === 'development', // 개발 환경 비활성화
});`,
          },
          {
            filename: 'public/manifest.json',
            content: `{
  "name": "Next Career App",
  "short_name": "Next-Career",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "lang": "ko",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}`,
          },
          {
            filename: 'src/app/_components/ui/CompletionAnimation.tsx',
            content: `'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const CompletionAnimation: React.FC<{
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
  lottieUrl?: string;
}> = ({ isVisible, onComplete, duration = 2000, lottieUrl }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        onComplete?.(); // 애니메이션 종료 후 콜백 (다음 화면 전환 등)
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  if (!shouldRender) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <DotLottieReact src={lottieUrl} loop={false} autoplay
        style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};`,
          },
        ],
      },
    ],
    conclusion: '이번 프로젝트에서 6가지 기술적 의사결정을 통해 공통적으로 얻은 교훈은 하나다. "나중에 고치면 되지"는 없다. 인증 중복 코드도, lint 미통과 커밋도, 모니터링 부재도 — 모두 초기에 구조를 잡지 않으면 기능이 쌓일수록 비용이 기하급수적으로 늘어난다.\n\n코드베이스 수치를 근거로 의사결정을 내리고, 자동화로 사람의 실수 가능성을 줄이고, 모니터링으로 프로덕션을 실시간 감지하는 것 — 이 세 가지가 앞으로의 프로젝트에서도 지키고 싶은 원칙이다.',
    award: '2025 kakao X 9oorm 시즌톤 최우수상',
    github: 'https://github.com/9oormthon-univ/2025_SEASONTHON_TEAM_42_FE',
    url: 'https://www.next-career.co.kr/',
    image: '/projects/next-career.png',
    relatedPosts: ['next-career'],
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
