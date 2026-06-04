# 데이터 계층

Notion CMS 연동, lib/ 함수, API Routes를 정리합니다.

## 파일 구조

| 파일 | 역할 |
| --- | --- |
| `lib/notion.ts` | Notion 블로그 포스트 DB 접근. 모든 포스트 데이터. |
| `lib/guestbook.ts` | Notion 방명록 DB 접근. 방명록 · 댓글. |
| `lib/github.ts` | GitHub GraphQL API. Giscus 댓글 수 · 최근 댓글. |
| `lib/utils.ts` | 순수 유틸 함수. formatDate, calculateReadingTime, getRelatedPosts. |
| `lib/structured-data.ts` | JSON-LD 스키마 빌더. buildBlogPostingSchema, buildBreadcrumbSchema. |
| `types/index.ts` | 공유 타입 정의. Post, Series, Comment 인터페이스. |

## Notion DB 스키마

### 블로그 포스트 DB (`NOTION_DATABASE_ID`)

| 속성명 | Notion 타입 | `Post` 필드 | 필수 |
| --- | --- | --- | --- |
| `Title` | title | `post.title` | ✅ |
| `Slug` | rich_text | `post.slug` | ✅ |
| `Date` | date | `post.date` | ✅ |
| `Published` | checkbox | `post.published` | ✅ |
| `Description` | rich_text | `post.description` | 권장 |
| `Tags` | multi_select | `post.tags: string[]` | 권장 |
| `Series` | rich_text | `post.series?: string` | 선택 |
| `Views` | number | `post.views?: number` | 선택 |
| Cover image | Notion 페이지 커버 | `post.coverImage?: string` | 선택 |

### 방명록 DB (`NOTION_GUESTBOOK_DATABASE_ID`)

| 속성명 | Notion 타입 | 설명 |
| --- | --- | --- |
| `Message` | title | 방명록 본문 |
| `Name` | rich_text | 작성자 이름 |
| `Public` | checkbox | false면 비밀 글 |
| `Password` | rich_text | 비밀 글 비밀번호 (plain text) |

댓글은 방명록 페이지의 paragraph block children에 `name|message` 형식으로 저장합니다.

## `lib/notion.ts` 주요 함수

| 함수 | 반환 | 설명 |
| --- | --- | --- |
| `getAllPosts()` | `Post[]` | Published=true 전체 포스트. Date 내림차순. React `cache()` 적용. |
| `getPostBySlug(slug)` | `Post \| null` | Slug 속성으로 단일 포스트 조회. |
| `getPostContent(pageId)` | `string` | Notion 블록 → Markdown. notion-to-md 사용. |
| `getPostsBySeries()` | `Record<string, Post[]>` | 시리즈별 포스트 그룹. |
| `getPopularPosts(limit?)` | `Post[]` | Views 내림차순 상위. 기본 5개. Views 없으면 최신순 폴백. |
| `getAllTags()` | `string[]` | 전체 고유 태그 목록. |
| `getAllSeries()` | `string[]` | 전체 고유 시리즈명 목록. |
| `incrementViews(pageId)` | `void` | Notion Views 속성 +1. |

## `lib/utils.ts` 주요 함수

| 함수 | 설명 |
| --- | --- |
| `formatDate(dateStr)` | `yyyy년 M월 d일` 형식 (date-fns, ko locale). |
| `calculateReadingTime(content)` | Markdown 문자열 기반 분당 200단어 환산. 최소 1분. |
| `getRelatedPosts(current, all, max?)` | 같은 시리즈(+10점) + 태그 교집합(×2점) 기준 정렬. 기본 최대 3개. |
| `cn(...classes)` | 조건부 클래스 결합. |

## `lib/structured-data.ts` 주요 함수

| 함수 | 설명 |
| --- | --- |
| `buildBlogPostingSchema(post, postUrl)` | schema.org BlogPosting JSON-LD. |
| `buildBreadcrumbSchema(post, postUrl)` | schema.org BreadcrumbList JSON-LD. |

`NEXT_PUBLIC_SITE_URL` 환경변수를 사용. 없으면 `https://yerim.dev` 폴백.

## `lib/guestbook.ts` 주요 함수

| 함수 | 설명 |
| --- | --- |
| `getGuestbookEntries()` | 전체 방명록 항목 + 댓글 수. |
| `addGuestbookEntry(msg, name?, isPublic?, password?)` | 방명록 생성. |
| `getComments(pageId)` | 특정 방명록의 댓글 목록. |
| `addComment(pageId, name, message)` | 댓글 추가. paragraph block 추가. |
| `getGuestbookEntryPassword(pageId)` | 비밀번호 조회. |
| `updateGuestbookEntryPassword(pageId, newPassword)` | 비밀번호 변경. |

## `lib/github.ts` 주요 함수

| 함수 | 설명 |
| --- | --- |
| `getCommentCounts(slugs)` | Giscus Discussion 댓글 수 (slug 배열). |
| `getRecentComments(limit?)` | 최근 댓글 목록. Sidebar에 사용. |

`GITHUB_TOKEN` 환경변수 필요.

## 데이터 추가 시 체크리스트

- Notion DB 속성 추가 → `extractPostMeta()` 수정 → `Post` 타입 업데이트 → 이 문서 업데이트.
- 새 API route → `docs/domains/route-map.md` 업데이트.
- 새 유틸 함수 → `lib/utils.ts`에 추가. 순수 함수 유지.
