# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint via next lint
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

## Architecture

This is a **Next.js 14 App Router** blog that uses **Notion as a CMS**.

### Data flow

Three data layer files in `lib/`:
- `lib/notion.ts` — wraps `@notionhq/client` and `notion-to-md`. All blog post data.
- `lib/guestbook.ts` — guestbook entries and comments via Notion API (separate DB).
- `lib/github.ts` — GitHub GraphQL API for Giscus comment counts and recent comments.

The `/api/search` route returns all posts as JSON for client-side search. All other data is fetched directly in server components.

Key functions in `lib/notion.ts`:
- `getAllPosts()` — queries the DB filtered by `Published: true`, sorted by `Date` desc
- `getPostBySlug(slug)` — looks up a post by its `Slug` rich_text property
- `getPostContent(pageId)` — converts Notion blocks to Markdown via `notion-to-md`
- `getPostsBySeries()` — groups posts by the `Series` property
- `getPopularPosts()` — top 5 by `Views` number property (falls back to newest)
- `incrementViews(pageId)` — increments the `Views` property by 1

Key functions in `lib/guestbook.ts`:
- `getGuestbookEntries()` — fetches all entries with comment counts (via block children)
- `addGuestbookEntry(message, name?, isPublic?, password?)` — creates a new Notion page in guestbook DB; stores `Password` property for private entries
- `getComments(pageId)` — lists block children of a page, parses `name|message` format
- `addComment(pageId, name, message)` — appends a paragraph block in `name|message` format
- `getGuestbookEntryPassword(pageId)` — lightweight single-page retrieve, returns password or null
- `updateGuestbookEntryPassword(pageId, newPassword)` — updates Notion `Password` property

### Notion DB schema

**Blog posts** — each page must have: `Title` (title), `Slug` (rich_text), `Description` (rich_text), `Date` (date), `Tags` (multi_select), `Published` (checkbox). Optional: `Series` (rich_text), `Views` (number).

**Guestbook** — `Message` (title), `Name` (rich_text), `Public` (checkbox), `Password` (rich_text, private entries only). Comments are stored as paragraph block children of the page in `name|message` format.

### Pages

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero banner + all posts + sidebar. `revalidate = 3600` |
| `/blog` | `app/blog/page.tsx` | Tag/series-filtered post list |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Post detail with TOC, Giscus comments, prev/next nav. `revalidate = 86400` |
| `/series` | `app/series/page.tsx` | Posts grouped by series |
| `/series/[seriesName]` | `app/series/[seriesName]/page.tsx` | Posts in a specific series |
| `/about` | `app/about/page.tsx` | Redirects to `/about/fe` |
| `/about/[version]` | `app/about/[version]/page.tsx` | Version-specific intro: `fe`, `be`, `pm` |
| `/about/projects/[slug]` | `app/about/projects/[slug]/page.tsx` | Project detail |
| `/project` | `app/project/page.tsx` | Project portfolio list |
| `/guestbook` | `app/guestbook/page.tsx` | Guestbook. `force-dynamic`. Mobile access allowed (other pages block mobile). |
| `/notices` | `app/notices/page.tsx` | Notice board. Accordion list with 신규 badge. Client component. |

### API Routes

| Route | Method | Description |
|---|---|---|
| `/api/search` | GET | Returns all published posts as JSON for client-side search |
| `/api/views/[slug]` | POST | Increments view count in Notion |
| `/api/guestbook` | GET, POST | List / create guestbook entries. POST accepts `password` for private entries. |
| `/api/guestbook/[id]/comments` | GET, POST | List / add comments. POST verifies password or admin PIN for private entries. |
| `/api/guestbook/[id]/verify` | POST | Verifies entry password or `ADMIN_PIN`. Body: `{ password }` |
| `/api/guestbook/[id]/password` | POST | Changes entry password after verification. Body: `{ currentPassword, newPassword }` |
| `/api/admin/verify-pin` | POST | Verifies `ADMIN_PIN` — used client-side before showing private entry content |

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
- Reusable CSS classes defined in `globals.css` `@layer components`: `.tag-badge` (neutral pill), `.card-hover`, `.sidebar-card` (8px radius, `--surface` bg)
- Fonts: Pretendard (sans), JetBrains Mono (code/monospace)

### Post rendering

`PostBody` renders Markdown using `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-slug`. Table of contents headings are extracted via regex from the raw Markdown in the `[slug]/page.tsx` server component before passing to the client-side `TableOfContents` component. Comments use **Giscus** (`GiscusComments`).
