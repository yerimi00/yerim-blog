# Route Map

현재 `app/` 기준 전체 라우트입니다.

## 공개 페이지

| 라우트 | 파일 | revalidate | 비고 |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | 3600 | HeroBanner + 전체 글 + 사이드바 |
| `/blog` | `app/blog/page.tsx` | 86400 | 시리즈 탭 필터 |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | 86400 | 포스트 상세. generateStaticParams. |
| `/blog/tag/[tag]` | `app/blog/tag/[tag]/page.tsx` | 3600 | 태그별 포스트 목록. generateStaticParams. |
| `/series` | `app/series/page.tsx` | 86400 | 시리즈 카드 목록 |
| `/series/[seriesName]` | `app/series/[seriesName]/page.tsx` | 86400 | 시리즈별 포스트. encodeURIComponent 처리. `seriesName === "인터랙션 모음"`이면 `InteractionSeriesView` 렌더 (포스트 목록 대신 서브폴더 그리드). Notion 포스트 없어도 항상 표시. |
| `/series/[seriesName]/[subFolder]` | `app/series/[seriesName]/[subFolder]/page.tsx` | 86400 | 인터랙션 모음 전용 서브폴더 포스트 목록. 데스크탑: flat list, 모바일(≤480px): CardStackPostList. seriesName이 "인터랙션 모음"이 아니면 404. |
| `/about` | `app/about/page.tsx` | — | `/about/fe` 리다이렉트 |
| `/about/[version]` | `app/about/[version]/page.tsx` | — | `fe`, `be`, `pm` 버전. 섹션 순서: About → Philosophy → Awards → Education → Activities → Tech Stack → Contact. Contact에 전화·이메일·GitHub·Velog 통합. |
| `/project` | `app/project/page.tsx` | 3600 | 프로젝트 포트폴리오. Notion Projects DB 기반. |
| `/project/[slug]` | `app/project/[slug]/page.tsx` | 3600 | 프로젝트 상세. 관련 블로그 글 트러블슈팅/회고/기타 섹션 분리. generateStaticParams. |
| `/notices` | `app/notices/page.tsx` | — | 공지사항 Accordion. Client Component. |
| `/guestbook` | `app/guestbook/page.tsx` | — | `force-dynamic`. 모바일 허용. |

## API Routes

| 라우트 | 메서드 | 파일 | 설명 |
| --- | --- | --- | --- |
| `/api/search` | GET | `app/api/search/route.ts` | 전체 포스트 JSON. 클라이언트 검색용. |
| `/api/views/[slug]` | POST | `app/api/views/[slug]/route.ts` | Notion `Views` +1 |
| `/api/guestbook` | GET, POST | `app/api/guestbook/route.ts` | 방명록 목록/작성 |
| `/api/guestbook/[id]/comments` | GET, POST | `app/api/guestbook/[id]/comments/route.ts` | 댓글 목록/작성. POST는 비밀번호 검증. |
| `/api/guestbook/[id]/verify` | POST | `app/api/guestbook/[id]/verify/route.ts` | 방명록 비밀번호 또는 ADMIN_PIN 검증 |
| `/api/guestbook/[id]/password` | POST | `app/api/guestbook/[id]/password/route.ts` | 비밀번호 변경 |
| `/api/admin/verify-pin` | POST | `app/api/admin/verify-pin/route.ts` | ADMIN_PIN 검증. 비밀 글 열람용. |

## 특수 Route Handlers

| 라우트 | 파일 | 설명 |
| --- | --- | --- |
| `/rss.xml` | `app/rss.xml/route.ts` | RSS 2.0 피드. `revalidate = 86400`. |

## 정적 파일

| 경로 | 용도 |
| --- | --- |
| `public/ads.txt` | Google AdSense 인증 |
| `public/manifest.json` | PWA 매니페스트 |
| `public/sw.js` | Service Worker |
| `public/logo.jpg` | 파비콘 · OG 이미지 폴백 |
| `public/profile.jpg` | About 프로필 이미지 |

## 라우트 추가 시 체크리스트

- `docs/domains/route-map.md` 업데이트.
- 새 동적 라우트에 `generateStaticParams` + `generateMetadata` 구현.
- SEO 노출 여부 결정 (`robots: { index: false }` 필요 여부).
- `revalidate` 값 결정 (콘텐츠 변경 빈도에 따라 3600 또는 86400).
