# 배포 전 체크리스트

Vercel 배포 전 확인 항목입니다.

## 빌드 검증

- [ ] `npm run build` — 빌드 에러 없음
- [ ] `npm run lint` — lint 에러 없음
- [ ] `npx tsc --noEmit` — 타입 에러 없음

## 환경변수 확인 (Vercel Dashboard)

- [ ] `NOTION_TOKEN` 설정됨
- [ ] `NOTION_DATABASE_ID` 설정됨
- [ ] `NOTION_GUESTBOOK_DATABASE_ID` 설정됨
- [ ] `GITHUB_TOKEN` 설정됨
- [ ] `NEXT_PUBLIC_GISCUS_REPO` 설정됨
- [ ] `NEXT_PUBLIC_GISCUS_REPO_ID` 설정됨
- [ ] `NEXT_PUBLIC_GISCUS_CATEGORY_ID` 설정됨
- [ ] `ADMIN_PIN` 설정됨
- [ ] `NEXT_PUBLIC_SITE_URL` — 실제 도메인으로 설정됨 (localhost 아님)
- [ ] `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` 설정됨
- [ ] `NEXT_PUBLIC_ADSENSE_POST_SLOT` 설정됨

## 페이지 동작 확인

- [ ] `/` 홈 — HeroBanner 슬라이드, 포스트 목록 로드
- [ ] `/blog` — 시리즈 탭 표시, 포스트 카드 로드
- [ ] `/blog/[slug]` — 포스트 본문, TOC, 읽기 진행 바, 소셜 공유, 관련 포스트, 댓글
- [ ] `/blog/tag/[tag]` — 태그 포스트 목록 (PostCard 태그 클릭으로 진입)
- [ ] `/series/[name]` — 시리즈 포스트 목록 (시리즈 탭 클릭으로 진입)
- [ ] `/rss.xml` — 유효한 RSS XML 응답
- [ ] `/guestbook` — 방명록 목록, 작성, 비밀 글 잠금

## SEO 확인

- [ ] 포스트 상세 페이지 소스에 `application/ld+json` 두 개 포함
- [ ] OG 메타태그에 포스트 title, description, 커버 이미지 포함
- [ ] `<head>`에 RSS link 태그 포함
- [ ] `https://도메인/ads.txt` 접근 시 AdSense 인증 내용 응답

## 기능 확인

- [ ] 포스트 코드 블록 복사 버튼 동작
- [ ] 이미지 클릭 시 medium-zoom 확대
- [ ] ` ```mermaid ` 블록이 다이어그램으로 렌더링
- [ ] 다크모드 토글 동작 및 localStorage 유지
- [ ] 포스트 상세 방문 시 조회수 증가 (Notion DB 확인)
