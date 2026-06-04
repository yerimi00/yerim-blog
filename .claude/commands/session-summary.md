# Session Summary

현재 세션에서 변경된 내용을 요약한다.

## Steps

1. `git status --short` 실행.
2. `git diff --stat`와 대상 `git diff`로 변경 파일 확인.
3. 기능 영역별로 변경 내용 요약.
4. 문서 업데이트 내용을 별도 목록으로 나열.
5. 실행된 검증 명령어와 결과 명시.
6. 추적되지 않은 파일 또는 `.env*` 관련 변경이 있으면 언급.

## Summary Rules

- 구현 변경, 문서 변경, 설정 변경을 분리해서 쓴다.
- `.claude/`처럼 gitignore된 파일도 실제로 바뀌었으면 언급한다.
- 실패한 검증은 실패 원인을 숨기지 말고 파일/에러 요약을 포함한다.
- PR 설명으로 바로 옮길 수 있도록 과장 없이 쓴다.
- `.env.local`은 내용을 출력하지 않는다. 변수 키 이름만 언급한다.

## Output Format

```markdown
## Change Summary

- Implementation: 변경된 동작 또는 코드 영역
- Configuration: 패키지, 빌드, 배포, 툴 설정 변경
- Documentation: 업데이트된 문서 파일

## Documentation Updated

- `path/to/document.md`: 변경 내용

## Verification

- `npm run lint`: passed / failed (요약)
- `npx tsc --noEmit`: passed / failed (요약)
- `npm run build`: passed / failed (요약)

## Remaining Notes

- 미해결 경고, 기존 이슈, 후속 작업
```
