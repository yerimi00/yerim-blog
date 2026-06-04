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
| `Header.tsx` | sticky, blur backdrop. 검색 모달 버튼, 다크모드 토글. |
| `Footer.tsx` | 사이트 정보, 소셜 링크. |

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
| `SeriesList.tsx` | — | 시리즈 카드 목록. |
| `SeriesView.tsx` | — | 시리즈 포스트 뷰. |
| `Sidebar.tsx` | — | 인기글 + 최근 댓글 + About 카드. |

## `components/about/`

| 파일 | 설명 |
| --- | --- |
| `AboutIntro.tsx` | 자기소개 섹션 |
| `AboutToc.tsx` | About 페이지 내부 목차 |
| `ProjectCard.tsx` | 프로젝트 카드 UI |
| `ProjectCardDeck.tsx` | 프로젝트 카드 덱 |
| `ProjectList.tsx` | 프로젝트 목록 |
| `TechStackGrid.tsx` | 기술 스택 그리드 |
| `TypewriterText.tsx` | 타이프라이터 애니메이션 텍스트 |
| `YearTimeline.tsx` | 연도별 타임라인 |

## `components/` (루트 전역)

| 파일 | Client? | 설명 |
| --- | --- | --- |
| `GoogleAdsense.tsx` | ✅ | AdSense `<ins>` 렌더. NEXT_PUBLIC_ADSENSE_PUBLISHER_ID 없으면 null. |
| `GuestbookFAB.tsx` | ✅ | 방명록 플로팅 액션 버튼. |
| `GuestbookForm.tsx` | ✅ | 방명록 작성 폼. |
| `GuestbookMessages.tsx` | ✅ | 방명록 메시지 목록. |
| `MobileBlockModal.tsx` | ✅ | 모바일 접속 차단 모달. guestbook 제외. |

## 컴포넌트 작성 규칙

- 데이터 호출은 page/Server Component에서 처리하고, UI 컴포넌트에는 필요한 props만 전달.
- 브라우저 API(scroll, clipboard, medium-zoom, mermaid)가 필요한 컴포넌트만 `'use client'`.
- `button`은 액션, `Link`는 네비게이션. `<Link>` 중첩은 불허 (PostCard는 article onClick + 내부 Link stopPropagation 패턴).
- heavy 오버레이(SearchModal)는 `{isOpen && <Modal />}` 패턴.
- Notion 이미지는 `next/image` 사용. stable height 또는 `fill` + 부모 relative 컨테이너.
- 반응형은 `styles/globals.css` `@media` 쿼리로. JavaScript 뷰포트 감지 불허.
