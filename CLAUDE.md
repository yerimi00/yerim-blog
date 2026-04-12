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

## Architecture

This is a **Next.js 14 App Router** blog that uses **Notion as a CMS**. All post data is fetched from Notion at request time (ISR with `revalidate = 60`).

### Data flow

`lib/notion.ts` is the single data layer — it wraps `@notionhq/client` and `notion-to-md`. Pages call its exported functions directly (no API route for most data). The `/api/search` route is the exception — it returns all posts as JSON for client-side search.

Key functions in `lib/notion.ts`:
- `getAllPosts()` — queries the DB filtered by `Published: true`, sorted by `Date` desc
- `getPostBySlug(slug)` — looks up a post by its `Slug` rich_text property
- `getPostContent(pageId)` — converts Notion blocks to Markdown via `notion-to-md`
- `getPostsBySeries()` — groups posts by the `Series` property
- `getPopularPosts()` — top 5 by `Views` number property (falls back to newest)

### Notion DB schema

Each page must have: `Title` (title), `Slug` (rich_text), `Description` (rich_text), `Date` (date), `Tags` (multi_select), `Published` (checkbox). Optional: `Series` (rich_text), `Views` (number).

### Pages

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero banner + all posts + sidebar |
| `/blog` | `app/blog/page.tsx` | Tag-filtered post list |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Post detail with TOC, comments, prev/next nav |
| `/series` | `app/series/page.tsx` | Posts grouped by series |
| `/about` | `app/about/page.tsx` | About page |

### Styling

- **Tailwind CSS** with `darkMode: 'class'` (toggled by `next-themes`)
- CSS custom properties for theming: `--bg`, `--bg-secondary`, `--text`, `--text-muted`, `--border`, `--accent` — defined in `styles/globals.css` for both light and dark modes
- Layout uses inline `style` props (not Tailwind utility classes) throughout most page/component files
- Reusable CSS classes defined in `globals.css` `@layer components`: `.tag-badge`, `.card-hover`, `.sidebar-card`
- Fonts: Pretendard (sans), Noto Serif KR (serif headings), JetBrains Mono (code)

### Post rendering

`PostBody` renders Markdown using `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-slug`. Table of contents headings are extracted via regex from the raw Markdown in the `[slug]/page.tsx` server component before passing to the client-side `TableOfContents` component. Comments use **Giscus** (`GiscusComments`).
