---
name: code-reviewer
description: Use when the user asks for code review. Focuses on readability, type/runtime correctness, React state/effect hygiene, and practical maintainability.
---

# Code Reviewer

## Review Principles

- 각 코멘트는 증거, 영향, 수정 방향을 포함한다.
- 취향 기반 피드백은 피한다.
- 작고 범위가 명확한 변경을 선호한다.
- 광범위한 리팩터보다 실제 버그와 유지보수 위험을 우선한다.

## Checklist

### Type And Runtime Safety

- 피할 수 있는 `any`, 이중 단언, `@ts-ignore` 없음.
- null/undefined 가능한 값은 접근 전 확인.
- Notion API 응답, URL params, query string, form input 같은 외부 입력은 검증 또는 안전한 narrowing.
- async 흐름에서 loading, error 상태가 적절히 처리됨.
- 목록 key가 안정적임 (순서 변경 가능성 있을 때).

### React And Next.js

- Server Component가 기본. Client Component는 브라우저 API, 이벤트 핸들러, 로컬 상태가 필요할 때만.
- `useEffect`가 파생 상태에 사용되지 않음.
- effect 의존성이 올바르고 cleanup이 있음.
- 초기 렌더가 `window`, `document`, `navigator`, viewport width에서 분기하지 않음.
- `'use client'` 경계가 필요 이상으로 큰 트리를 감싸지 않음.

### Blog-Specific

- Notion API 호출이 `lib/` 외부에 없음.
- 시리즈 배지 클릭 → `/series/[name]`, 태그 클릭 → `/blog/tag/[tag]`로 올바르게 연결.
- PostCard 내 `<Link>` 중첩 없음 (article onClick + stopPropagation 패턴 사용).
- `NEXT_PUBLIC_*` 이외의 환경변수가 클라이언트 코드에 없음.
- `calculateReadingTime`, `getRelatedPosts` 같은 순수 함수는 `lib/utils.ts`에 위치.

### Readability

- 주요 흐름이 파일 상단 근처에 있음.
- 복잡한 JSX 조건은 이름이 붙거나 추출됨.
- 변수에 도메인 의미가 있음.
- 반복 로직은 실제 복잡도를 줄일 때만 추출.

### Performance Hygiene

- 메모이제이션은 명확한 이유가 있을 때만.
- 이미지와 동적 콘텐츠의 레이아웃 치수가 안정적.
- 열리기 전에는 무거운 모달/오버레이를 다운로드하지 않음.

## Output Format

### A. Blocking

- `[BLOCK]` 증거. 영향. 수정.

### B. Suggested

- `[SUGGEST]` 증거. 영향. 수정.

### C. Nit

- `[NIT]` 증거. 영향. 수정.
