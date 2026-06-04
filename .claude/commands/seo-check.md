# SEO Check

메타데이터, canonical URL, Open Graph 태그, JSON-LD, RSS, robots 동작을 확인할 때 사용한다.

## Steps

1. 해당 `page.tsx`, `layout.tsx`, `route.ts`의 metadata export를 읽는다.
2. title, description, canonical, `openGraph`, robots 설정을 확인한다.
3. `app/blog/[slug]/page.tsx`의 JSON-LD 스키마(`BlogPosting`, `BreadcrumbList`)를 확인한다.
4. `/rss.xml` route가 올바른 title, link, description, pubDate를 포함하는지 확인한다.
5. `/blog/tag/[tag]` 및 `/series/[seriesName]` 페이지에 `generateMetadata`가 구현되어 있는지 확인한다.
6. `app/layout.tsx`의 `<link rel="alternate" type="application/rss+xml">` 태그를 확인한다.
7. 누락되거나 중복된 메타데이터를 파일 참조와 함께 보고한다.

## Blog-Specific Notes

- 포스트 상세 페이지: `title`, `description`, `openGraph.images` (coverImage), `publishedTime`, JSON-LD 필수.
- 태그/시리즈 목록 페이지: 색인 가능, 태그/시리즈명 기반 한국어 description.
- 방명록(`/guestbook`), 어드민 API, 개인 정보가 노출되는 페이지: `robots: noindex` 고려.
- `NEXT_PUBLIC_SITE_URL`이 올바른 도메인으로 설정되어 있는지 확인한다.
- `public/ads.txt`가 존재하는지 확인한다 (AdSense 인증).

## Output Format

```markdown
## SEO Findings

### ✅ 정상
- ...

### ⚠️ 개선 필요
- `파일 경로`: 문제 설명 및 수정 방향

### ❌ 누락
- `파일 경로`: 누락된 항목
```
