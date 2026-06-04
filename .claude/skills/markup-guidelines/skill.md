---
name: markup-guidelines
description: Use for React/Next.js markup, responsive UI, SSR, hydration, semantic HTML, and accessibility work.
---

# Hydration-Safe Markup Guidelines

## Goals

- 서버 렌더와 클라이언트 초기 렌더를 동일하게 유지한다.
- 반응형 레이아웃은 CSS로 구현하고 JavaScript viewport 감지를 사용하지 않는다.
- 시맨틱하고 접근 가능한 유효한 HTML을 사용한다.
- 불필요한 다운로드와 레이아웃 이동을 방지한다.

## Rules

1. 초기 렌더 중 `window`, `document`, `navigator`, `localStorage`, `matchMedia`에 접근하지 않는다.
2. 브라우저 전용 로직은 effect, 이벤트 핸들러, 또는 격리된 client component 안에 배치한다.
3. 첫 번째 렌더에서 모바일/데스크탑 마크업을 JavaScript 뷰포트 상태로 선택하지 않는다.
4. CSS 미디어 쿼리(`globals.css @media`)와 안정적인 DOM 구조를 사용한다.
5. 액션에는 `button`, 네비게이션에는 `Link`/`a`를 사용한다. `<a>` 중첩은 불허.
6. 폼 입력에 label을 연결한다.
7. MediumZoom, SearchModal 같은 무거운 오버레이는 열렸을 때만 렌더한다.
8. `next/image`를 사용하는 이미지에는 안정적인 width/height 또는 aspect-ratio를 부여한다.
9. Notion 이미지 URL은 next.config.js의 `remotePatterns`에 등록된 도메인을 사용한다.

## Review Checklist

- 렌더 경로에 클라이언트 전용 API 없음.
- 초기 UI에 JavaScript 반응형 분기 없음.
- 시맨틱 섹션과 랜드마크가 합리적.
- 인터랙티브 요소가 키보드 접근 가능.
- 이미지에 유용한 alt 텍스트 또는 장식용일 때 빈 alt.
- PostCard 내 Link 중첩 없음 (article onClick 패턴 사용).
- 동적 콘텐츠가 주변 레이아웃을 예기치 않게 이동시키지 않음.
