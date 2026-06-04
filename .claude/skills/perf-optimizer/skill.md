---
name: perf-optimizer
description: Use for Next.js performance review, Core Web Vitals, LCP, image/video loading, client bundle size, and loading behavior.
---

# Performance Optimizer

## Focus Areas

### LCP

- 페이지 변경 전 LCP 요소를 파악한다.
- `HeroBanner`의 슬라이더 이미지나 포스트 커버 이미지가 LCP인 경우 `priority` 사용.
- 진짜 above-the-fold LCP 이미지에만 `priority`를 사용한다.
- 주요 above-the-fold 콘텐츠를 client-only로 렌더하지 않는다.

### Images

- Notion 이미지(`prod-files-secure.s3...`, `notion.so`)는 `next/image`로 최적화.
- below-the-fold 이미지는 lazy load.
- `next/image`의 `sizes` prop을 반응형에 맞게 정확히 설정.
- width/height 또는 aspect-ratio를 안정적으로 유지.
- `minimumCacheTTL`은 next.config.js에서 1800초 이상 유지.

### Client JavaScript

- 큰 트리에 `'use client'`를 붙이지 않는다. 작은 인터랙티브 단위만 client component로.
- `MermaidBlock`, `MediumZoom` 같은 무거운 라이브러리는 dynamic import 또는 `useEffect` 내 lazy load.
- 데이터 패칭은 Server Component로 이동. `lib/notion.ts`는 React `cache()`로 중복 요청 방지.
- `BlogFilter`, `PostCard`처럼 이미 client인 컴포넌트는 추가 context 없이 사용.

### Modals And Hidden UI

- `SearchModal`, `GuestbookFAB` 같은 오버레이는 `{isOpen && <Modal />}` 패턴.
- `MediumZoom`은 포스트 상세 페이지에서만 마운트.

### React Patterns

- 메모이제이션은 실제 렌더 비용 또는 참조 동등성 이유가 있을 때만.
- `getAllPosts()`는 큰 목록이므로 캐시를 유지하고 중복 호출 줄이기.
- ISR `revalidate` 값: 홈 3600, 포스트 목록/상세 86400, 태그 3600.

## Output

기대 영향에 따라 우선순위를 매긴다:

- High: LCP, 클라이언트 전용 주요 콘텐츠, 불필요하게 큰 번들.
- Medium: below-fold 미디어 로딩, 숨겨진 모달 콘텐츠, 반복적인 비용 높은 작업.
- Low: 소규모 정리 또는 nice-to-have 튜닝.
