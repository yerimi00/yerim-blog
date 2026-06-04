# Known Issues

현재 코드 기준으로 확인된 이슈입니다. 삭제 또는 수정 전 근거를 확인하세요.

## P1 — 즉시 처리 권장

| 이슈 | 근거 | 영향 | 권장 조치 |
| --- | --- | --- | --- |
| NEXT_PUBLIC_SITE_URL 프로덕션 도메인 미설정 | `.env.local`에서 `http://localhost:3001/`로 설정됨 | JSON-LD `@id`, RSS `<link>` 등 절대 URL이 localhost를 가리킴 | Vercel 환경변수에 `https://yerim.dev` (실제 도메인) 설정 |
| NEXT_PUBLIC_ADSENSE_POST_SLOT 미설정 | `.env.local`에 값 없음 | AdSense 광고가 렌더되지 않음 | AdSense 콘솔에서 광고 단위 생성 후 슬롯 ID 입력 |

## P2 — 가능하면 처리

| 이슈 | 근거 | 영향 | 권장 조치 |
| --- | --- | --- | --- |
| PostCard에 읽기 시간 표시 없음 | `getAllPosts()`는 본문을 패칭하지 않아 목록 카드에서 readingTime 계산 불가 | 포스트 상세 페이지에서만 읽기 시간 표시됨 | 별도 패칭 비용이 크므로 현재 상태 유지 또는 description 글자 수 기반 추정 고려 |
| RelatedPosts 모바일 레이아웃 | 모바일에서 1열 세로 배치로 전환됨 | 커버 이미지가 없는 포스트는 회색 박스만 표시 | 모바일에서 커버 이미지 없는 카드 레이아웃 개선 고려 |
| Notion 이미지 URL 만료 | Notion S3 이미지 URL은 1시간 후 만료됨 | `next/image`의 `minimumCacheTTL=1800`이지만 원본 URL 만료 시 이미지 깨짐 | Cloudinary 또는 별도 이미지 프록시 고려 |

## 운영/콘텐츠

| 이슈 | 영향 | 권장 조치 |
| --- | --- | --- |
| 모바일 차단 모달이 대부분 페이지에 적용됨 | 모바일 사용자의 `/guestbook` 외 페이지 접근 불가 | 실제 서비스 방향에 따라 모바일 차단 범위 재검토 |
| `app/layout.tsx`의 `openGraph.url`이 `yerim.vercel.app`로 하드코딩됨 | 실제 도메인과 다르면 OG 공유 시 잘못된 URL 노출 | `NEXT_PUBLIC_SITE_URL` 사용하도록 수정 고려 |
