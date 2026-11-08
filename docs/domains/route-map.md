# Route Map

현재 `app/` 기준 전체 라우트입니다.

## 공개 페이지

| 라우트 | 파일 | revalidate | 비고 |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | 3600 | 캐릭터 이미지·떨어지는 태그·기록 눈금 히어로 + 최근 글 5 + 오늘의 면접 질문 + 대표 작업 4 (Featured) |
| `/blog` | `app/blog/page.tsx` | 86400 | 시리즈 탭 필터 + `/blog/series` 링크 |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | 86400 | 포스트 상세. generateStaticParams. canonical 설정. |
| `/blog/tag/[tag]` | `app/blog/tag/[tag]/page.tsx` | 3600 | 태그별 포스트 목록. generateStaticParams. |
| `/blog/series` | `app/blog/series/page.tsx` | 86400 | 시리즈 폴더 목록. `interactions` 시리즈는 제외 (`/lab`으로 승격). |
| `/blog/series/[name]` | `app/blog/series/[name]/page.tsx` | 86400 | 시리즈별 포스트. encodeURIComponent 처리. |
| `/interview` | `app/interview/page.tsx` | 3600 | 오늘의 면접 질문(최신 발행 1개) + 지난 문제 아카이브(카테고리 필터). Interview DB 미설정 시 "준비 중" 안내. |
| `/interview/[slug]` | `app/interview/[slug]/page.tsx` | 3600 | 문제 상세. 답변(Notion 본문)·꼬리질문·참고 링크는 `AnswerReveal`로 가렸다가 30초 타이머 또는 "답 보기"로 공개. 이전/다음 문제, AdSense, Giscus. |
| `/lab` | `app/lab/page.tsx` | — | 인터랙션 실험 그리드 (`app/data/interactions/interactions-data.ts`의 `DEMOS`). 상세를 준비 중이라 카드는 링크 없이 표시. |
| `/lab/[slug]` | `app/lab/[slug]/page.tsx` | 86400 | 준비 중이라 `next.config.js`에서 `/lab`으로 임시 리다이렉트. 데모 코드는 유지. |
| `/about` | `app/about/page.tsx` | — | `/about/fe` 리다이렉트 |
| `/about/[version]` | `app/about/[version]/page.tsx` | — | `fe`, `be`, `pm` 버전. 섹션 순서: About → Philosophy → Awards → Education → Activities → Tech Stack → Contact. Contact에 전화·이메일·GitHub·Velog 통합. |
| `/work` | `app/work/page.tsx` | 3600 | 헤드(요약·바로가기), 대표작 지면(Featured), 나머지 아카이브(직무·수상 필터, 커서 미리보기), `#ai-skills` (직접 만든 자동화만 기본 표시). |
| `/work/[slug]` | `app/work/[slug]/page.tsx` | 3600 | 프로젝트 상세. 관련 블로그 글 트러블슈팅/회고 섹션 분리. generateStaticParams. |
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
| `/sitemap.xml` | `app/sitemap.ts` | 정적 페이지 + 글·시리즈·면접 문제·Work 전체, Lab은 목록만. `revalidate = 3600`. |
| `/robots.txt` | `app/robots.ts` | 전체 허용, `/api/` 제외, sitemap 주소 명시. |

## 리다이렉트 (`next.config.js`, 308 permanent)

IA v2 이전 전 링크 보호용. 구체적인 규칙이 위에 있어야 한다.

| 기존 | 새 주소 |
| --- | --- |
| `/series/interactions`, `/series/interactions/:slug` | `/lab`, `/lab/:slug` |
| `/series`, `/series/:name` | `/blog/series`, `/blog/series/:name` |
| `/project`, `/project/:slug` | `/work`, `/work/:slug` |
| `/ai-skills` | `/work#ai-skills` |

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
