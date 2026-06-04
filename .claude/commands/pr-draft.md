# PR Draft

현재 브랜치의 변경사항을 분석해 PR 설명 초안을 작성한다.

## Steps

1. `git status --short` 실행.
2. 베이스 브랜치를 확인한다. 없으면 `main` 기준.
3. `git diff`로 변경사항을 확인한다.
4. 사용자 대면 기능 또는 기술 단위로 변경 내용을 요약한다.
5. 검증 명령어와 결과를 포함한다.
6. UI가 변경됐으면 스크린샷이 필요한 항목을 명시한다.
7. 문서 업데이트 내용을 별도로 명시한다.

## Notes

- 존재하지 않는 이슈 번호나 링크를 넣지 않는다.
- Notion CMS 의존 동작(slug, published 상태, DB 필드)이 있으면 명시한다.
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` 등 환경변수가 필요한 기능은 명시한다.
- 초안은 간결하고 리뷰어 중심으로 작성한다.
