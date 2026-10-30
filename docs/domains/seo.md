# SEO

yerim.dev의 메타데이터, JSON-LD, RSS, OG, robots 설정을 정리합니다.

## 환경변수

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `lib/site.ts`의 `SITE_URL`. metadataBase, OG url, JSON-LD, RSS, sitemap, robots 절대 URL. 없으면 `https://yerim-blog.vercel.app` 폴백. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 구글 서치콘솔 소유 확인 메타 (`metadata.verification.google`). 선택. |
| `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` | 네이버 서치어드바이저 소유 확인 메타 (`naver-site-verification`). 선택. |

사이트 URL·이름·설명은 `lib/site.ts`(`SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`) 한 곳에서만 정의한다.

## 기본 메타데이터 (`app/layout.tsx`)

```typescript
metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { type: 'website', locale: 'ko_KR', url: SITE_URL, siteName: SITE_NAME },
  verification: { google: ..., other: { 'naver-site-verification': ... } },
  icons: { icon: '/logo.jpg', apple: '/logo.jpg' },
}
```

공개 페이지는 `alternates.canonical`에 상대 경로를 넣고, `metadataBase`가 절대 URL로 바꿔 준다.

## sitemap · robots

- `app/sitemap.ts` → `/sitemap.xml`. 정적 페이지 + `/blog/[slug]` + `/blog/series/[name]` + `/interview/[slug]` + `/lab/[slug]` + `/work/[slug]`. 새 글은 revalidate(1시간) 후 자동 반영.
- `app/robots.ts` → `/robots.txt`. `/api/` 제외, sitemap 주소 명시.

RSS 링크 태그 (`app/layout.tsx` `<head>`):
```html
<link rel="alternate" type="application/rss+xml" title="yerim.dev RSS" href="/rss.xml" />
```

## 포스트 상세 메타데이터 (`app/blog/[slug]/page.tsx`)

`generateMetadata`로 동적 생성:
- `title`: `post.title`
- `description`: `post.description`
- `openGraph.images`: `post.coverImage` (없으면 빈 배열)
- `openGraph.type`: `'article'`
- `openGraph.publishedTime`: `post.date`

## JSON-LD (`lib/structured-data.ts`)

포스트 상세 페이지에 두 스크립트 삽입:

### BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "포스트 제목",
  "description": "포스트 설명",
  "image": "커버 이미지 URL 또는 /logo.jpg",
  "datePublished": "ISO 날짜",
  "dateModified": "ISO 날짜",
  "author": { "@type": "Person", "name": "yerim", "url": "SITE_URL" },
  "publisher": { "@type": "Organization", "name": "yerim.dev", "logo": { "@type": "ImageObject", "url": "SITE_URL/logo.jpg" } },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "포스트 전체 URL" },
  "keywords": "태그1, 태그2"
}
```

### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "SITE_URL" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "SITE_URL/blog" },
    { "@type": "ListItem", "position": 3, "name": "포스트 제목", "item": "포스트 전체 URL" }
  ]
}
```

## RSS 피드 (`app/rss.xml/route.ts`)

- 형식: RSS 2.0
- 항목: title, link, guid, description, pubDate, category(태그)
- `Content-Type: application/xml; charset=utf-8`
- `Cache-Control: public, s-maxage=86400, stale-while-revalidate`
- `revalidate = 86400`

## 태그/시리즈 페이지 메타데이터

| 라우트 | title | description |
| --- | --- | --- |
| `/blog/tag/[tag]` | `#태그명` | `태그명 태그가 달린 글 모음` |
| `/blog/series/[name]` | `시리즈명 — Series` | `시리즈명 시리즈 글 모음` |
| `/interview/[slug]` | 질문 | `한 줄 요약` (없으면 질문) |
| `/lab/[slug]` | `데모명 — Lab` | 데모 설명 |
| `/work/[slug]` | `프로젝트명 — Work` | 프로젝트 Description |

## 소셜 공유 버튼 (`components/blog/SocialShare.tsx`)

포스트 상세 헤더에 위치. 지원 플랫폼:

| 버튼 | 동작 |
| --- | --- |
| LinkedIn | `https://www.linkedin.com/sharing/share-offsite/?url=...` 새 창 |
| 링크 복사 | `navigator.clipboard.writeText(url)`, 1.5초 후 원복 |

## AdSense (`public/ads.txt`)

```
google.com, pub-2089460148182991, DIRECT, f08c47fec0942fa0
```

`public/ads.txt`로 배포 시 `https://도메인/ads.txt`에 자동 제공됩니다.

## SEO 변경 시 체크리스트

- 새 공개 라우트 추가 → `generateMetadata` 구현.
- 포스트 상세 구조 변경 → `buildBlogPostingSchema`, `buildBreadcrumbSchema` 확인.
- 도메인 변경 → Vercel의 `NEXT_PUBLIC_SITE_URL`만 바꾸면 된다 (`lib/site.ts`). 이후 서치콘솔·서치어드바이저에 sitemap 재제출.
- 비공개/어드민 라우트 → `robots: { index: false }` 추가 고려.
