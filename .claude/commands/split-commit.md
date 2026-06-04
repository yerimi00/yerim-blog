# Split Commit

누적된 변경사항을 논리적 커밋으로 나누어 사용자 승인 후 커밋한다.

## Steps

1. `git status --short` 확인.
2. 스테이징되지 않은 diff와 스테이징된 diff를 읽는다.
3. feat, fix, refactor, docs, chore, perf 등으로 파일을 그룹화한다.
4. 커밋 그룹과 메시지를 제안한다.
5. 승인 전까지 스테이징이나 커밋을 진행하지 않는다.

## Rules

- 관련 없는 변경을 섞지 않는다.
- 파일을 명시적으로 스테이징한다 (`git add -A` 사용 금지).
- 각 커밋 전 스테이징된 diff를 확인한다.
- 한 줄 커밋 메시지를 사용한다.
- conventional prefix 사용: `feat`, `fix`, `refactor`, `docs`, `chore`, `perf`.
- 동작 변경을 설명하는 문서 업데이트는 해당 커밋에 포함한다.
- `.env.local` 등 비밀값이 포함된 파일은 스테이징하지 않는다.
