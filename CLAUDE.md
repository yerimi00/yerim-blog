# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint via next lint
npx tsc --noEmit # Type check without emitting files
```

There are no tests configured in this project.

## Environment Variables

Required in `.env.local`:
- `NOTION_TOKEN` — Notion integration secret
- `NOTION_DATABASE_ID` — ID of the Notion database containing posts
- `NOTION_GUESTBOOK_DATABASE_ID` — ID of the Notion database for guestbook entries
- `GITHUB_TOKEN` — GitHub token for GraphQL API (comment counts, recent comments)
- `NEXT_PUBLIC_GISCUS_REPO` — GitHub repo for Giscus (`owner/repo`)
- `NEXT_PUBLIC_GISCUS_REPO_ID` — Giscus repository ID
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID` — Giscus category ID
- `ADMIN_PIN` — PIN for accessing private guestbook entries and their comments
- `NEXT_PUBLIC_SITE_URL` — Full site URL for RSS and JSON-LD (e.g. `https://yerim.dev`)
- `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` — Google AdSense publisher ID (`ca-pub-*`)
- `NEXT_PUBLIC_ADSENSE_POST_SLOT` — AdSense ad unit slot ID for post pages
- `NOTION_PROJECTS_DATABASE_ID` — ID of the Notion Projects database
- `NOTION_ACTIVITIES_DATABASE_ID` — ID of the Notion Activities database (`cc1bc9501c2546e580c4efa5a6e05cab`)

## Core Principles

1. Prefer Server Components unless browser APIs, stateful interactions, or event handlers require a Client Component.
2. Keep all Notion/GitHub data access in `lib/` — never call Notion API directly from components.
3. Do not expose secrets in client code. Only `NEXT_PUBLIC_*` values may be used in browser bundles.
4. Use CSS custom properties (`var(--*)`) and `styles/globals.css` tokens for all design values. Do not hardcode colors or spacing.
5. Avoid `any`; use explicit types or `unknown` with narrowing.
6. Preserve existing user changes. Do not rewrite unrelated files while solving a task.
7. Never read, print, or commit `.env*` contents.

## Required Work Protocol

모든 작업은 아래 순서를 반드시 지킨다. 단계를 건너뛰거나 순서를 바꾸지 않는다.

1. **Plan** — 관련 파일을 검토하고 구체적인 구현 플랜을 작성한다.
2. **컨펌** — 유저의 명시적인 승인을 기다린다. 승인 전에는 코드·문서를 수정하지 않는다.
3. **컨펌 확인** — 승인 내용이 플랜과 일치하는지 확인한다. 범위가 달라졌으면 플랜으로 돌아간다.
4. **개발** — 승인된 플랜만 구현한다. 도중에 플랜을 변경해야 하면 즉시 멈추고 유저에게 확인을 받는다.
5. **검수** — 구현 후 타입 체크(`npx tsc --noEmit`), 빌드(`npm run build`), 또는 `/verify`로 동작을 검증한다.
6. **영향도 체크** — 변경이 기존 컴포넌트·페이지·API에 사이드 이펙트를 일으키는지 확인한다.
7. **관련 문서 업데이트** — 라우트, API, 아키텍처, 컴포넌트 구조, 프로토콜 등 변경된 사항을 이 파일과 `docs/`에 반영한다.

Use `/plan` for an explicit planning step. Use `/session-summary` to summarize current session changes.

## Architecture

This is a **Next.js 14 App Router** blog that uses **Notion as a CMS**.

### Data flow

Four data layer files in `lib/`:
- `lib/notion.ts` — wraps `@notionhq/client` and `notion-to-md`. All blog post data.
- `lib/projects.ts` — Projects Notion DB 조회. `getAllProjects`, `getProjectBySlug`.
- `lib/guestbook.ts` — guestbook entries and comments via Notion API (separate DB).
- `lib/github.ts` — GitHub GraphQL API for Giscus comment counts and recent comments.
- `lib/utils.ts` — `formatDate`, `cn`, `calculateReadingTime`, `getRelatedPosts`.
- `lib/structured-data.ts` — `buildBlogPostingSchema`, `buildBreadcrumbSchema` (JSON-LD).

The `/api/search` route returns all posts as JSON for client-side search. All other data is fetched directly in server components.

Key functions in `lib/notion.ts`:
- `getAllPosts()` — queries the DB filtered by `Published: true`, sorted by `Date` desc
- `getPostBySlug(slug)` — looks up a post by its `Slug` rich_text property
- `getPostContent(pageId)` — converts Notion blocks to Markdown via `notion-to-md`
- `getPostsBySeries()` — groups posts by the `Series` property
- `getPopularPosts()` — top 5 by `Views` number property (falls back to newest)
- `getAllTags()` — all unique tags across published posts
- `getAllSeries()` — all unique series names
- `incrementViews(pageId)` — increments the `Views` property by 1
- `getPostsByProject(projectSlug)` — Blog Posts DB에서 `Project == slug` 필터 후 `{ troubleshooting, retrospective, other }` 분류
- `getAllActivities()` — Activities DB 전체 조회 → `Activity[]` (`{ period, title, category }`) 반환. About 페이지 server component에서 호출 후 prop으로 전달

Key functions in `lib/projects.ts`:
- `getAllProjects()` — Projects DB 전체 조회 (React cache)
- `getProjectBySlug(slug)` — 슬러그로 단건 조회

Key functions in `lib/guestbook.ts`:
- `getGuestbookEntries()` — fetches all entries with comment counts (via block children)
- `addGuestbookEntry(message, name?, isPublic?, password?)` — creates a new Notion page in guestbook DB
- `getComments(pageId)` — lists block children of a page, parses `name|message` format
- `addComment(pageId, name, message)` — appends a paragraph block in `name|message` format
- `getGuestbookEntryPassword(pageId)` — returns password or null
- `updateGuestbookEntryPassword(pageId, newPassword)` — updates Notion `Password` property

### Notion DB schema

**Blog posts** — each page must have: `Title` (title), `Slug` (rich_text), `Description` (rich_text), `Date` (date), `Tags` (multi_select), `Published` (checkbox). Optional: `Series` (rich_text), `Views` (number), `Project` (rich_text — 연결 프로젝트 슬러그).

**Projects** — `Name` (title), `Slug` (rich_text), `Featured` (checkbox), `Description` (rich_text), `Overview` (rich_text), `Status` (select: 완료/진행중), `Period` (rich_text), `UpdatedAt` (rich_text), `Roles` (multi_select), `Tech` (multi_select), `Award` (rich_text), `GitHub` (url), `URL` (url), `Image` (rich_text — 이미지 URL). 담당 기능은 Notion 페이지 본문에 기술.

**Guestbook** — `Message` (title), `Name` (rich_text), `Public` (checkbox), `Password` (rich_text, private entries only). Comments stored as paragraph block children in `name|message` format.

### Pages

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero banner + all posts + sidebar. `revalidate = 3600` |
| `/blog` | `app/blog/page.tsx` | Series-tab post list. `revalidate = 86400` |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Post detail: TOC, reading time, social share, related posts, JSON-LD, Giscus, AdSense. `revalidate = 86400` |
| `/blog/tag/[tag]` | `app/blog/tag/[tag]/page.tsx` | Posts filtered by tag (URL-based). `revalidate = 3600` |
| `/series` | `app/series/page.tsx` | Posts grouped by series. "인터랙션 모음" 폴더 항상 표시 (Notion 포스트 없어도 hardcode 주입) |
| `/series/[seriesName]` | `app/series/[seriesName]/page.tsx` | Posts in a specific series. `seriesName === "인터랙션 모음"`이면 `InteractionSeriesView` 렌더 |
| `/series/[seriesName]/[subFolder]` | `app/series/[seriesName]/[subFolder]/page.tsx` | 인터랙션 모음 전용 서브폴더. 모바일: CardStackPostList, 데스크탑: flat list. `revalidate = 86400` |
| `/about` | `app/about/page.tsx` | Redirects to `/about/fe` |
| `/about/[version]` | `app/about/[version]/page.tsx` | Version-specific intro: `fe`, `be`, `pm`. 섹션: About · Philosophy · Awards · Education · Activities · Tech Stack · Contact (GitHub·Velog 포함). `AboutToc` 목차 연동. |
| `/project` | `app/project/page.tsx` | Project portfolio list |
| `/project/[slug]` | `app/project/[slug]/page.tsx` | Project detail |
| `/guestbook` | `app/guestbook/page.tsx` | Guestbook. `force-dynamic`. Mobile access allowed. |
| `/notices` | `app/notices/page.tsx` | Notice board. Accordion. Client component. |
| `/rss.xml` | `app/rss.xml/route.ts` | RSS 2.0 feed. `revalidate = 86400` |

### API Routes

| Route | Method | Description |
|---|---|---|
| `/api/search` | GET | Returns all published posts as JSON for client-side search |
| `/api/views/[slug]` | POST | Increments view count in Notion |
| `/api/guestbook` | GET, POST | List / create guestbook entries |
| `/api/guestbook/[id]/comments` | GET, POST | List / add comments |
| `/api/guestbook/[id]/verify` | POST | Verifies entry password or `ADMIN_PIN` |
| `/api/guestbook/[id]/password` | POST | Changes entry password |
| `/api/admin/verify-pin` | POST | Verifies `ADMIN_PIN` for private content access |

### Component Structure

| Path | Purpose |
|---|---|
| `components/layout/` | Header, Footer (`site-footer` — 모바일 숨김), BottomNav (모바일 ≤480px 하단 네비), MobileFooterLinks (모바일 About 하단 링크) |
| `components/blog/` | Post-related UI: PostCard, PostBody, BlogFilter, HeroBanner, TableOfContents, SocialShare, RelatedPosts, ReadingProgress, CopyButton, MediumZoom, MermaidBlock |
| `components/about/` | About page UI blocks |
| `components/project/` | Project page UI |
| `components/GoogleAdsense.tsx` | AdSense ad unit (client component) |
| `components/GuestbookFAB.tsx` | 방명록 FAB. 웹: 전 페이지. 모바일(≤480px): 홈(`/`)에서만 가로 레이아웃으로 표시. |

### Styling

- **Tailwind CSS** with `darkMode: 'class'` (toggled by `next-themes`)
- Design system: **Insight Minimalist** (`DESIGN.md`) — Corporate/Modern Minimalism, Material Design 3 color tokens
- CSS custom properties defined in `styles/globals.css`:
  - Surfaces: `--bg`, `--bg-secondary`, `--surface`, `--surface-container`, `--surface-container-high`
  - Text: `--text`, `--text-secondary`, `--text-muted`
  - Borders: `--border`, `--border-subtle`, `--outline`, `--outline-variant`
  - Accent: `--accent`, `--accent-dim`, `--secondary`, `--secondary-container`
  - Shadows: `--shadow-floating`, `--shadow-card`
  - Radii: `--radius-sm` (2px), `--radius` (4px), `--radius-md` (6px), `--radius-lg` (8px), `--radius-xl` (12px), `--radius-full` (9999px)
- Tailwind theme extensions (`tailwind.config.js`):
  - Colors: all CSS vars aliased + `ds.*` palette (full MD3 tokens)
  - FontSize: `ds-h1`, `ds-h2`, `ds-h3`, `ds-body-lg`, `ds-body`, `ds-label`, `ds-caption`
  - Spacing: `ds-xs` ~ `ds-3xl`; BoxShadow: `shadow-ds-floating`
- Layout uses inline `style` props (not Tailwind utility classes) throughout most page/component files
- Reusable CSS classes in `globals.css` `@layer components`: `.tag-badge`, `.card-hover`, `.sidebar-card`, `.series-tab-btn`, `.related-posts-grid`
- `.series-tab-bar` / `.series-tab-btn`: `touch-action: pan-x` + `user-select: none` — 모바일 수평 스크롤 중 텍스트 드래그 선택 방지
- Responsive utility classes (media-query-only, not in `@layer components`): `.home-grid`, `.post-grid`, `.project-view-grid` (grid blowout 방지 `min-width: 0`), `.hero-section` (≤768px `margin: 0.5rem 0 1rem`), `.hero-banner` (≤768px `height: 240px`), `.hero-banner-content` (≤768px `padding: 1.25rem 1.5rem 3rem`), `.hero-banner-date` (절대 위치 고정 — 슬라이드별 날짜 높이 일관성), `.project-hero-banner`, `.project-hero-banner-content`, `.project-list-period` (≤480px 숨김), `.post-row-date` (≤480px 숨김), `.post-card-title` (≤480px 3줄 clamp), `.guestbook-grid`, `.series-folder-grid`, `.about-edu-row` / `.about-activity-row` / `.about-row-period` (≤768px 세로 스택), `.card-stack-mobile` / `.post-list-desktop` (≤480px 카드스택 표시 / 리스트 숨김 토글)
- Fonts: Pretendard (sans), JetBrains Mono (code/monospace)

### Post Rendering

`PostBody` renders Markdown via `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-slug`. Special handling:
- ` ```mermaid ` code blocks → `MermaidBlock` (client, dynamic import of mermaid.js)
- `pre` blocks → `CopyButton` overlay for clipboard copy
- All `.post-body img` elements → `MediumZoom` (medium-zoom library)
- TOC headings extracted via regex in `[slug]/page.tsx` before passing to `TableOfContents`

### Component Guidelines

- Split files by responsibility: fetching, transformation, UI, and side effects should not be mixed.
- For UI work, keep markup hydration-safe. Do not branch initial render on `window`, `document`, `navigator`, or viewport width.
- Implement responsive UI with CSS media queries (`globals.css`), not JavaScript viewport state.
- Use `button` for actions, `Link` for navigation. Never nest `<a>` elements.
- Render heavy overlays (modals, image zoom) conditionally, not hidden with CSS.

### Performance

- Identify the LCP element before changing hero or image sections. Use `priority` only for above-the-fold LCP images.
- Below-the-fold images should lazy load with stable dimensions.
- Avoid marking large trees `'use client'` when only a small control is interactive.
- Move data fetching to Server Components when possible. `lib/notion.ts` functions use React `cache()` for request deduplication.
- Do not add `useMemo`, `useCallback`, or `React.memo` without a specific reason.

## AI Commands And Skills

Local Claude commands live under `.claude/commands/`:

- `plan.md` — inspect first, write plan, wait for confirmation.
- `session-summary.md` — summarize current session changes.
- `code-review.md` — review selected or changed code.
- `pr-draft.md` — draft a PR description from current changes.
- `split-commit.md` — propose logical commit groups.
- `seo-check.md` — inspect metadata, OG tags, JSON-LD, RSS.
- `sync-plan.md` — compare a plan doc with actual implementation and rewrite as built.

Reusable skills live under `.claude/skills/`:

- `code-review` — readability, type/runtime correctness, React effect hygiene.
- `markup-guidelines` — SSR-safe markup, hydration safety, responsive UI, accessibility.
- `perf-optimizer` — Core Web Vitals, LCP, image loading, client bundle review.

Agent definitions live under `.claude/agents/`:

- `notion-layer-builder.md` — Notion data layer, API routes, lib/ utilities.
- `blog-feature-reviewer.md` — performance, CLS, side-effect, and architecture review.

Saved plan files live under `.claude/plans/`. Use `/sync-plan <path>` to reconcile a plan with the actual implementation.

Detailed domain documentation lives under `docs/`. See `docs/README.md` for the full index (route map, data layer, components, SEO, styling, flows, QA).
