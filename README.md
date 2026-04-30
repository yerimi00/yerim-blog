# yerim.dev

> 피할 수 없다면 즐..즐입니다 ~ KIN

**배포 URL**: https://yerim.vercel.app

---

## 기술 스택

| 분류       | 기술                                 |
| ---------- | ------------------------------------ |
| 프레임워크 | Next.js 14 (App Router)              |
| 언어       | TypeScript                           |
| 스타일     | Tailwind CSS + CSS Custom Properties |
| CMS        | Notion API (`@notionhq/client`)      |
| 댓글       | Giscus (GitHub Discussions)          |
| 배포       | Vercel                               |
| 폰트       | Pretendard, JetBrains Mono           |

---

## 주요 기능

### 블로그

- Notion 데이터베이스를 CMS로 사용하여 포스트 관리
- ISR(Incremental Static Regeneration)으로 빌드 캐싱
- 태그 / 시리즈 필터링
- 포스트 내 목차(TOC) 자동 생성
- `Cmd+K` / `Ctrl+K` 클라이언트 사이드 검색
- 조회수 추적 (Notion `Views` 속성 업데이트)
- Giscus 댓글 (GitHub Discussions 연동)
- 사이드바: 인기글, 최근 댓글, 한줄 소개 (FE·BE·PM 링크)

### 방명록

- 공개 / 비공개 메시지 선택
- 비공개 메시지 작성 시 열람 비밀번호 설정 (Notion `Password` 속성 저장)
- 비공개 메시지: 비밀번호 또는 관리자 PIN 인증 후 내용 표시
- 비밀번호 변경 기능 (인증 후 인라인 폼)
- 댓글 기능: 비공개 항목 댓글은 비밀번호 / 관리자 PIN 인증 후 작성 가능
- 방명록 전용 플로팅 액션 버튼(FAB)
- [임시] 모바일에서는 방명록 페이지만 접근 허용

### About

- FE / BE / PM 버전별 소개 페이지
- 기술 스택 그리드, 연도별 활동 타임라인, 타이핑 애니메이션

### 프로젝트 포트폴리오

- 프로젝트 목록 및 상세 페이지

### 공통

- 라이트 / 다크 모드 토글 (`next-themes`)
- 반응형 레이아웃 (모바일 일부 기능 제한)
- 404, 로딩 상태 페이지

---

## 환경 변수

`.env.local` 파일에 아래 변수를 설정해야 합니다.

| 변수                             | 필수 | 설명                                     |
| -------------------------------- | ---- | ---------------------------------------- |
| `NOTION_TOKEN`                   | ✅   | Notion Integration Secret                |
| `NOTION_DATABASE_ID`             | ✅   | 블로그 포스트 Notion DB ID               |
| `NOTION_GUESTBOOK_DATABASE_ID`   | -    | 방명록 Notion DB ID                      |
| `GITHUB_TOKEN`                   | -    | GitHub GraphQL API 토큰 (댓글 수 조회용) |
| `NEXT_PUBLIC_GISCUS_REPO`        | -    | Giscus 저장소 (`owner/repo`)             |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | -    | Giscus 카테고리 ID                       |
| `ADMIN_PIN`                      | -    | 방명록 비공개 항목 관리자 PIN            |

---

## 디렉토리 구조

```
yerim-blog/
├── app/
│   ├── page.tsx                  # 홈 (인기글 배너 + 전체 글)
│   ├── blog/[slug]/              # 포스트 상세
│   ├── series/                   # 시리즈 목록 / 상세
│   ├── about/[version]/          # 소개 (fe / be / pm)
│   ├── project/                  # 프로젝트 목록
│   ├── guestbook/                # 방명록
│   └── api/                      # API 라우트
│       ├── search/               # 검색
│       ├── views/[slug]/         # 조회수
│       ├── guestbook/            # 방명록 CRUD
│       │   └── [id]/
│       │       ├── comments/    # 방명록 댓글
│       │       ├── verify/      # 비밀번호 / PIN 검증
│       │       └── password/    # 비밀번호 변경
│       └── admin/verify-pin/    # 관리자 PIN 검증
├── components/
│   ├── layout/                   # Header, Footer
│   ├── blog/                     # PostCard, PostBody, TOC, Sidebar 등
│   ├── about/                    # AboutIntro, TechStackGrid 등
│   ├── project/                  # ProjectView, ProjectHeroBanner
│   ├── GuestbookForm.tsx
│   ├── GuestbookMessages.tsx
│   ├── GuestbookFAB.tsx
│   └── MobileBlockModal.tsx
└── lib/
    ├── notion.ts                 # Notion 데이터 계층
    ├── guestbook.ts              # 방명록 / 댓글 로직
    ├── github.ts                 # GitHub GraphQL (Giscus 댓글 수)
    └── utils.ts                  # 유틸리티 함수
```

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 린트
npm run lint
```

---

## Notion DB 스키마

### 블로그 포스트

| 속성        | 타입         | 필수 |
| ----------- | ------------ | ---- |
| Title       | title        | ✅   |
| Slug        | rich_text    | ✅   |
| Description | rich_text    | ✅   |
| Date        | date         | ✅   |
| Tags        | multi_select | ✅   |
| Published   | checkbox     | ✅   |
| Series      | rich_text    | -    |
| Views       | number       | -    |

### 방명록

| 속성     | 타입      | 설명                              |
| -------- | --------- | --------------------------------- |
| Message  | title     | 방명록 본문                       |
| Name     | rich_text | 작성자 이름                       |
| Public   | checkbox  | 공개 여부                         |
| Password | rich_text | 열람 비밀번호 (비공개 항목만 저장) |

댓글은 해당 Notion 페이지의 블록 자식으로 저장됩니다. (`이름\|메시지` 형식)

---

## 변경 이력

> Keep a Changelog 형식을 따릅니다.
> 변경 유형: `Added` 새 기능 / `Changed` 변경 / `Fixed` 버그 수정 / `Removed` 제거

### [Unreleased]

### [2026-04-30]

#### Added

- 방명록 비공개 메시지 작성 시 열람 비밀번호 설정 기능
- 비밀번호 변경 기능 (인증 후 인라인 폼으로 제공)
- `/api/guestbook/[id]/verify` — 비밀번호 / 관리자 PIN 검증 엔드포인트
- `/api/guestbook/[id]/password` — 비밀번호 변경 엔드포인트
- 방명록 페이지 상단 업데이트 공지 배너

#### Changed

- 비공개 방명록 인증: 관리자 PIN 전용 → 항목별 비밀번호 + 관리자 PIN(마스터 오버라이드)으로 변경
- Notion 방명록 DB에 `Password` (rich_text) 속성 추가

### [2026-04-29]

#### Added

- 방명록 댓글 기능 (Notion 페이지 블록 활용)
- 방명록 비공개 항목 관리자 PIN 인증
- PIN 인증 후 비공개 메시지 내용 표시
- 댓글 수 서버 사이드 프리로드 (카드별 댓글 개수 표시)
- 방명록 FAB, 모바일 접근 제한 예외 처리 (`/guestbook` 페이지)

#### Fixed

- 방명록 댓글 수 `undefined개` 버그 수정
- PIN 인증 후 댓글 작성 폼이 바로 열리지 않던 문제 수정
- 빌드 오류 (`commentCount` 타입 누락) 수정
