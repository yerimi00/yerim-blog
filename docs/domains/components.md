# 컴포넌트 구조

yerim-blog 컴포넌트는 `components/` 아래 기능별로 구성됩니다.

## 디렉터리 기준

| 디렉터리 | 기준 |
| --- | --- |
| `components/layout/` | 전 페이지 공통 Header, Footer |
| `components/blog/` | 포스트 목록 · 상세 관련 UI |
| `components/about/` | About 페이지 전용 UI 블록 |
| `components/project/` | 프로젝트 포트폴리오 UI |
| `components/` (루트) | 앱 전역 컴포넌트 (GoogleAdsense, GuestbookFAB 등) |

## `components/layout/`

| 파일 | 설명 |
| --- | --- |
| `Header.tsx` | sticky, blur backdrop. 검색 모달 버튼, 다크모드 토글. 모바일에서는 검색·테마 버튼만 표시 (햄버거 메뉴 없음). |
| `Footer.tsx` | 사이트 정보, 소셜 링크. `className="site-footer"` — 모바일(≤480px)에서 숨김. |
| `BottomNav.tsx` | ✅ | 모바일 전용(≤480px) 하단 고정 네비게이션 바. 5탭: Home · Blog · Series · Project · About. `usePathname()`으로 active 탭 표시. `min-height: 56px` + `padding-bottom: env(safe-area-inset-bottom)` — iOS/AOS PWA 홈 인디케이터 영역 대응. `viewportFit: 'cover'` 필수. |
| `MobileFooterLinks.tsx` | — | 모바일 전용(≤480px) About 페이지 하단 푸터 링크 섹션. 공지사항·개발자에게·GitHub·Velog 2열 그리드. |

## `components/blog/`

| 파일 | Client? | 설명 |
| --- | --- | --- |
| `PostCard.tsx` | ✅ | 포스트 목록 카드. article onClick + 태그 Link stopPropagation. |
| `BlogFilter.tsx` | ✅ | 시리즈 탭 + 포스트 목록. `useState`로 탭 클릭 시 컴포넌트 내 클라이언트 필터링. 같은 탭 재클릭 시 전체로 복귀. |
| `PostBody.tsx` | — | Markdown 렌더러. CopyButton, MermaidBlock 포함. |
| `CopyButton.tsx` | ✅ | 코드 블록 복사 버튼. 1.5초 후 자동 복원. |
| `MermaidBlock.tsx` | ✅ | mermaid.js 동적 import, SVG 렌더링. |
| `MediumZoom.tsx` | ✅ | `.post-body img` 전체에 medium-zoom 연결. |
| `ReadingProgress.tsx` | ✅ | 상단 3px 읽기 진행 바. scroll 이벤트. |
| `SocialShare.tsx` | ✅ | LinkedIn 공유 + 링크 복사. |
| `RelatedPosts.tsx` | — | 관련 포스트 3개 카드 그리드. |
| `HeroBanner.tsx` | ✅ | 인기글 슬라이더. 4초 자동 전환. |
| `TableOfContents.tsx` | ✅ | 포스트 목차. IntersectionObserver로 active 섹션 추적. |
| `PostNavigation.tsx` | — | 이전/다음 포스트 링크. |
| `ViewTracker.tsx` | ✅ | 마운트 시 조회수 +1 API 호출. |
| `GiscusComments.tsx` | ✅ | GitHub Discussions 댓글 위젯. |
| `SearchModal.tsx` | ✅ | 클라이언트 사이드 전문 검색 모달. |
| `SeriesView.tsx` | — | 시리즈 포스트 뷰. 항상 그리드 표시 (리스트 토글 제거됨). |
| `Sidebar.tsx` | — | 인기글 + 최근 댓글 + About 카드. |

## `components/about/`

| 파일 | 설명 |
| --- | --- |
| `AboutIntro.tsx` | 자기소개 섹션 (fe·be·pm 버전별 텍스트) |
| `AboutToc.tsx` | About 페이지 내부 목차. 섹션: About · Philosophy · Awards · Education · Activities · Tech Stack · Contact. IntersectionObserver로 active 추적. |
| `ProjectCard.tsx` | 프로젝트 카드 UI. `NotionProject` 타입 사용. |
| `ProjectCardDeck.tsx` | 프로젝트 카드 덱. `NotionProject` 타입 사용. |
| `ProjectList.tsx` | 프로젝트 타임라인 목록. `NotionProject` 타입 사용. |
| `TechStackGrid.tsx` | 기술 스택 그리드 |
| `TypewriterText.tsx` | 타이프라이터 애니메이션 텍스트 |
| `YearTimeline.tsx` | 연도별 타임라인 |

## `components/project/`

| 파일 | 설명 |
| --- | --- |
| `ProjectHeroBanner.tsx` | 주요 프로젝트 슬라이드 배너 (featured=true). 4초 자동 전환. `NotionProject` 타입 사용. |
| `ProjectView.tsx` | 전체 프로젝트 리스트/그리드 뷰 토글. `NotionProject` 타입 사용. |

## `components/` (루트 전역)

| 파일 | Client? | 설명 |
| --- | --- | --- |
| `GoogleAdsense.tsx` | ✅ | AdSense `<ins>` 렌더. NEXT_PUBLIC_ADSENSE_PUBLISHER_ID 없으면 null. |
| `GuestbookFAB.tsx` | ✅ | 방명록 플로팅 액션 버튼. 웹: 모든 페이지 표시. 모바일(≤480px): 홈(`/`)에서만 표시, 가로 레이아웃 + 말풍선 왼쪽 표출. |
| `GuestbookForm.tsx` | ✅ | 방명록 작성 폼. |
| `GuestbookMessages.tsx` | ✅ | 방명록 메시지 목록. |

## 컴포넌트 작성 규칙

- 데이터 호출은 page/Server Component에서 처리하고, UI 컴포넌트에는 필요한 props만 전달.
- 브라우저 API(scroll, clipboard, medium-zoom, mermaid)가 필요한 컴포넌트만 `'use client'`.
- `button`은 액션, `Link`는 네비게이션. `<Link>` 중첩은 불허 (PostCard는 article onClick + 내부 Link stopPropagation 패턴).
- heavy 오버레이(SearchModal)는 `{isOpen && <Modal />}` 패턴.
- Notion 이미지는 `next/image` 사용. stable height 또는 `fill` + 부모 relative 컨테이너.
- 반응형은 `styles/globals.css` `@media` 쿼리로. JavaScript 뷰포트 감지 불허.
