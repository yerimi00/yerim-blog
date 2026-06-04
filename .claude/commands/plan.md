# Plan

변경 작업 전에 구현 계획을 작성하고 사용자 확인을 받는다.

## Required Behavior

1. 관련 파일을 먼저 읽는다.
2. 다음을 포함한 짧은 계획을 작성한다:
   - 대상 파일 또는 영역
   - 구현 단계
   - 예상 문서 업데이트 (CLAUDE.md 라우트/API 변경 시)
   - 검증 명령어
3. 사용자의 명시적 확인을 기다린다.
4. 확인 전까지 코드나 문서를 편집하지 않는다.
5. 확인 후 승인된 계획만 따른다.
6. 계획을 바꿔야 할 상황이 생기면 다시 확인을 구한다.

## Blog Checklist

- 영향 범위가 `app/` 라우트인지, `components/` UI인지, `lib/` 데이터 계층인지 구분한다.
- Notion DB 스키마 변경이 필요한지 확인한다.
- 보안 관련 값 (`.env*`, `ADMIN_PIN`, Notion token)은 읽거나 출력하지 않는다.
- SEO 영향이 있는 변경 (메타데이터, JSON-LD, RSS, 라우팅)은 계획에 명시한다.
- CLAUDE.md 업데이트 대상이 무엇인지 계획에 포함한다.
- 검증은 `npm run lint`, `npx tsc --noEmit`, `npm run build` 중 최소 범위를 선택한다.

## Output Format

```markdown
## Plan

1. `target file or folder`을 확인해 현재 동작을 파악한다.
2. `target file`을 수정해 `requested behavior`를 구현한다.
3. `verification command`를 실행하고 결과를 확인한다.

## Documentation

- CLAUDE.md 또는 기능별 문서에서 변경된 동작을 반영한다.

## Verification

- `npm run lint` — 린트 수준 변경 시
- `npx tsc --noEmit` — 타입 또는 API 계약 변경 시
- `npm run build` — 라우트, Next.js 설정, 배포 동작 변경 시

## 이 계획대로 진행해도 될까요?
```
