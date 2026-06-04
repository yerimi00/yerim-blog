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
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID` — Giscus category ID
- `ADMIN_PIN` — PIN for accessing private guestbook entries and their comments
- `NEXT_PUBLIC_SITE_URL` — Full site URL for RSS and JSON-LD (e.g. `https://yerim.dev`)
- `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` — Google AdSense publisher ID (`ca-pub-*`)
- `NEXT_PUBLIC_ADSENSE_POST_SLOT` — AdSense ad unit slot ID for post pages

## Core Principles

1. Prefer Server Components unless browser APIs, stateful interactions, or event handlers require a Client Component.
2. Keep all Notion/GitHub data access in `lib/` — never call Notion API directly from components.
3. Do not expose secrets in client code. Only `NEXT_PUBLIC_*` values may be used in browser bundles.
4. Use CSS custom properties (`var(--*)`) and `styles/globals.css` tokens for all design values. Do not hardcode colors or spacing.
5. Avoid `any`; use explicit types or `unknown` with narrowing.
6. Preserve existing user changes. Do not rewrite unrelated files while solving a task.
7. Never read, print, or commit `.env*` contents.

## Required Work Protocol

Every significant task must follow this protocol:

1. Inspect the relevant files and write a short implementation plan.
2. Wait for explicit user confirmation before making code or documentation changes.
3. After confirmation, implement only the confirmed plan.
4. If the plan must change mid-implementation, stop and ask for confirmation again.
5. After completing a task, update the related section of this file if routes, API, or architecture changed.

Use `/plan` for an explicit planning step. Use `/session-summary` to summarize current session changes.

## Architecture

This is a **Next.js 14 App Router** blog that uses **Notion as a CMS**.

### Data flow

Three data layer files in `lib/`:
- `lib/notion.ts` — wraps `@notionhq/client` and `notion-to-md`. All blog post data.
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

Key functions in `lib/guestbook.ts`:
- `getGuestbookEntries()` — fetches all entries with comment counts (via block children)
- `addGuestbookEntry(message, name?, isPublic?, password?)` — creates a new Notion page in guestbook DB
- `getComments(pageId)` — lists block children of a page, parses `name|message` format
- `addComment(pageId, name, message)` — appends a paragraph block in `name|message` format
- `getGuestbookEntryPassword(pageId)` — returns password or null
- `updateGuestbookEntryPassword(pageId, newPassword)` — updates Notion `Password` property

### Notion DB schema

**Blog posts** — each page must have: `Title` (title), `Slug` (rich_text), `Description` (rich_text), `Date` (date), `Tags` (multi_select), `Published` (checkbox). Optional: `Series` (rich_text), `Views` (number).

**Guestbook** — `Message` (title), `Name` (rich_text), `Public` (checkbox), `Password` (rich_text, private entries only). Comments stored as paragraph block children in `name|message` format.

### Pages

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero banner + all posts + sidebar. `revalidate = 3600` |
| `/blog` | `app/blog/page.tsx` | Series-tab post list. `revalidate = 86400` |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Post detail: TOC, reading time, social share, related posts, JSON-LD, Giscus, AdSense. `revalidate = 86400` |
| `/blog/tag/[tag]` | `app/blog/tag/[tag]/page.tsx` | Posts filtered by tag (URL-based). `revalidate = 3600` |
| `/series` | `app/series/page.tsx` | Posts grouped by series |
| `/series/[seriesName]` | `app/series/[seriesName]/page.tsx` | Posts in a specific series |
| `/about` | `app/about/page.tsx` | Redirects to `/about/fe` |
| `/about/[version]` | `app/about/[version]/page.tsx` | Version-specific intro: `fe`, `be`, `pm` |
| `/about/projects/[slug]` | `app/about/projects/[slug]/page.tsx` | Project detail |
| `/project` | `app/project/page.tsx` | Project portfolio list |
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
| `components/layout/` | Header, Footer |
| `components/blog/` | Post-related UI: PostCard, PostBody, BlogFilter, HeroBanner, TableOfContents, SocialShare, RelatedPosts, ReadingProgress, CopyButton, MediumZoom, MermaidBlock |
| `components/about/` | About page UI blocks |
| `components/project/` | Project page UI |
| `components/GoogleAdsense.tsx` | AdSense ad unit (client component) |

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
