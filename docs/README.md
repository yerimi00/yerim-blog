# yerim.dev Docs

yerim-blog 프론트엔드의 흐름, 도메인, QA 기준을 한곳에서 찾기 위한 문서 허브입니다.

## 먼저 볼 문서

| 목적 | 문서 |
| --- | --- |
| 전체 블로그 구조 파악 | [flows/overview.md](flows/overview.md) |
| 독자 관점 탐색 흐름 | [flows/reader-flow.md](flows/reader-flow.md) |
| 작성자 관점 발행 흐름 | [flows/author-flow.md](flows/author-flow.md) |
| 실제 App Router 라우트 | [domains/route-map.md](domains/route-map.md) |
| Notion DB · lib 함수 · API Routes | [domains/data-layer.md](domains/data-layer.md) |
| 컴포넌트 구조 | [domains/components.md](domains/components.md) |
| SEO · JSON-LD · RSS | [domains/seo.md](domains/seo.md) |
| 디자인 시스템 · CSS 변수 | [domains/styling.md](domains/styling.md) |
| 인터랙션 모음 컴포넌트 | [interactions.md](interactions.md) |
| 배포 전 체크리스트 | [qa/release-checklist.md](qa/release-checklist.md) |
| 현재 확인된 이슈 | [qa/known-issues.md](qa/known-issues.md) |

## 도메인별 참조

| 도메인 | 문서 | 주로 참조하는 코드 |
| --- | --- | --- |
| 라우팅 | [domains/route-map.md](domains/route-map.md) | `app/` |
| 데이터 계층 | [domains/data-layer.md](domains/data-layer.md) | `lib/notion.ts`, `lib/guestbook.ts`, `lib/github.ts`, `lib/utils.ts`, `lib/structured-data.ts` |
| 컴포넌트 | [domains/components.md](domains/components.md) | `components/` |
| SEO | [domains/seo.md](domains/seo.md) | `app/blog/[slug]/page.tsx`, `app/rss.xml/route.ts`, `lib/structured-data.ts` |
| 스타일 | [domains/styling.md](domains/styling.md) | `styles/globals.css`, `tailwind.config.js` |

## Claude Code 가이드

AI 작업 프로토콜, 환경변수 전체 목록, 아키텍처 원칙은 루트 [`CLAUDE.md`](../CLAUDE.md)를 참조하세요.

## 문서 업데이트 원칙

1. 기능 변경 전 관련 코드와 기존 문서를 먼저 확인합니다.
2. 변경 후 영향받은 도메인 문서와 흐름 문서를 같은 커밋에 함께 업데이트합니다.
3. 새 라우트 추가 시 `domains/route-map.md`를 반드시 업데이트합니다.
4. 새 Notion DB 필드 추가 시 `domains/data-layer.md`를 반드시 업데이트합니다.
5. SEO 관련 변경 시 `domains/seo.md`를 반드시 업데이트합니다.
6. 확정되지 않은 항목은 `qa/known-issues.md`에 근거 경로와 함께 남깁니다.
