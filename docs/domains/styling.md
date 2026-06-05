# 스타일 시스템

yerim.dev의 디자인 시스템, CSS 변수, Tailwind 설정을 정리합니다.

## 디자인 시스템

**Insight Minimalist** — Corporate/Modern Minimalism, Material Design 3 color tokens.
상세 토큰 정의는 `DESIGN.md` 참조.

## 파일 구조

| 파일 | 역할 |
| --- | --- |
| `styles/globals.css` | CSS 변수, base styles, 반응형, `@layer components` |
| `tailwind.config.js` | Tailwind 테마 확장 (색상, 폰트, 간격, 그림자) |

## CSS 커스텀 프로퍼티

### 라이트 모드 (`:root`)

| 변수 | 값 | 용도 |
| --- | --- | --- |
| `--bg` | `#ffffff` | 페이지 주 배경 |
| `--bg-secondary` | `#f3f4f6` | 보조 배경, 코드 블록 |
| `--surface` | `#ffffff` | 카드 배경 |
| `--surface-container` | `#edeef0` | 컨테이너 배경 |
| `--text` | `#191c1e` | 주 텍스트 |
| `--text-secondary` | `#424754` | 보조 텍스트 |
| `--text-muted` | `#6b7280` | 흐린 텍스트, 메타 정보 |
| `--border` | `#e5e7eb` | 기본 구분선 |
| `--border-subtle` | `#f3f4f6` | 약한 구분선 |
| `--outline-variant` | `#c2c6d6` | hover 테두리 |
| `--accent` | `#3b82f6` | 파란색 강조 (링크, 배지, 진행 바) |
| `--accent-dim` | `#0058be` | 진한 파란색 |
| `--shadow-floating` | `0 10px 15px...` | 플로팅 그림자 |

### 다크 모드 (`.dark`)

- 배경: `#111827` (bg), `#1f2937` (bg-secondary)
- 텍스트: `#f0f1f3`
- Accent: `#60a5fa` (더 밝은 파란색)

### Border Radius

| 변수 | 값 |
| --- | --- |
| `--radius-sm` | 2px |
| `--radius` | 4px |
| `--radius-md` | 6px |
| `--radius-lg` | 8px |
| `--radius-xl` | 12px |
| `--radius-full` | 9999px |

## `@layer components` 재사용 클래스

| 클래스 | 용도 |
| --- | --- |
| `.tag-badge` | 중성 색상 태그 배지 |
| `.sidebar-card` | 8px radius, `--surface` 배경, 보더 |
| `.series-tab-btn` | 시리즈 탭. `.active` 시 파란 하단 선 |
| `.toc-link` | 목차 링크 |
| `.nav-link` | 헤더 네비게이션 링크 |
| `.prose-blockquote` | 인용구 (좌측 파란 선) |
| `.callout`, `.callout-blue`, `.callout-yellow` 등 | Notion callout 블록 (8가지 색상) |
| `.notion-columns`, `.notion-column` | Notion 컬럼 레이아웃 |
| `.related-posts-grid` | 관련 포스트 3열 그리드 (모바일 1열) |
| `.series-tab-bar` | 시리즈 탭 컨테이너. `overflow-x: auto` 가로 스크롤, 스크롤바 숨김. |
| `.series-tab-btn` | 시리즈 탭 버튼. `white-space: nowrap`으로 텍스트 줄바꿈 방지. `flex-shrink: 0`. |

## 반응형 미디어 쿼리

| breakpoint | 적용 클래스 |
| --- | --- |
| `max-width: 768px` | `.home-grid` 단일 컬럼, `.home-sidebar` 숨김, `.post-grid` 단일 컬럼, `.about-edu-row` / `.about-activity-row` 세로 스택, `.about-row-period` min-width 해제, `.related-posts-grid` 단일 컬럼, `.project-hero-banner` 높이 200px |
| `max-width: 480px` | `.header-nav` 숨김, `.mobile-header-actions` 표시, `.bottom-nav` 표시, `.site-footer` 숨김, `.mobile-footer-links` 표시, `.guestbook-fab` 숨김 (홈만 표시), `.post-card-title` 3줄 clamp, `.post-row-date` / `.project-list-period` 숨김, `.guestbook-grid` 단일 컬럼 |

## Tailwind 확장 (`tailwind.config.js`)

- `darkMode: 'class'`
- `fontFamily`: `sans` (Pretendard), `mono` (JetBrains Mono)
- 색상 토큰: CSS vars aliased (`bg`, `surface`, `text`, `accent` 등) + `ds.*` MD3 팔레트
- `fontSize`: `ds-h1` ~ `ds-caption`
- `spacing`: `ds-xs` ~ `ds-3xl`
- `boxShadow`: `shadow-ds-floating`

## PWA / Safe Area 대응

`app/layout.tsx`의 `viewport`에 `viewportFit: 'cover'` 설정 — 콘텐츠가 노치·홈 인디케이터 영역까지 확장됩니다.

| 적용 위치 | CSS |
| --- | --- |
| `.bottom-nav` | `padding-bottom: env(safe-area-inset-bottom, 0px)` |
| `main` (≤480px) | `padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 2rem)` |
| `.guestbook-fab--home` (≤480px) | `bottom: calc(56px + env(safe-area-inset-bottom, 0px) + 1.25rem)` |

iOS Safari PWA, Android Chrome PWA 모두 대응합니다. `viewportFit: 'cover'` 없이는 `env()` 값이 항상 0으로 반환됩니다.

## 레이아웃 패턴

대부분의 페이지/컴포넌트는 Tailwind utility 클래스 대신 **inline `style` prop**을 사용합니다.

```tsx
// 주 컨테이너 패턴
<main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>

// 2열 그리드 패턴
<div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '4rem' }}>
```

## 폰트

- **Pretendard**: 본문, 제목 (CDN: `cdn.jsdelivr.net/gh/orioncactus/pretendard`)
- **JetBrains Mono**: 코드, 인라인 코드 (Google Fonts)

## 스타일 변경 시 체크리스트

- 새 CSS 변수 → `:root` + `.dark` 양쪽에 추가.
- 새 재사용 클래스 → `globals.css` `@layer components`에 추가.
- 새 Tailwind 토큰 → `tailwind.config.js` `theme.extend`에 추가.
- 반응형 → CSS 미디어 쿼리 사용. JavaScript viewport 감지 불허.
