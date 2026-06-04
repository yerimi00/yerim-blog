# Code Review

`.claude/skills/code-review/skill.md`를 리뷰 기준으로 사용한다.

## Procedure

1. 변경 파일과 주변 호출 지점을 읽는다.
2. TypeScript, 런타임 엣지 케이스, 하이드레이션 안전성, React state/effect 사용을 확인한다.
3. UI 변경에는 `.claude/skills/markup-guidelines/skill.md`도 적용한다.
4. 이미지, Notion 이미지 URL, HeroBanner, 포스트 커버처럼 성능에 민감한 변경에는 `.claude/skills/perf-optimizer/skill.md`도 적용한다.
5. yerim-blog 고유 경계를 확인한다:
   - Notion 데이터 접근은 `lib/notion.ts`, `lib/guestbook.ts`, `lib/github.ts` 경유.
   - UI 컴포넌트는 `components/` 하위.
   - 유틸리티는 `lib/utils.ts` 또는 `lib/structured-data.ts`.
   - `'use client'`는 브라우저 API, 이벤트 핸들러, 로컬 상태가 필요한 경우에만.

## Output

발견 사항을 심각도 순으로 나열한다.

- `[BLOCK]` 머지 전 반드시 수정.
- `[SUGGEST]` 가능하면 수정.
- `[NIT]` 선택 사항.

각 항목에는 증거, 영향, 구체적 수정 방향을 포함한다.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```
