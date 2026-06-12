# 인터랙션 모음 문서

라우트: `/series/interactions/{slug}`
컴포넌트 위치: `components/blog/*Demo.tsx`
페이지 진입점: `app/series/[seriesName]/[subFolder]/page.tsx`
목록 뷰: `components/blog/InteractionSeriesView.tsx`

---

## 공통 구현 패턴

### 카드 스택 계열 (CardStack / HorizontalSwipe / CenteredSwipe / ColorCardStack)

4개 컴포넌트가 동일한 아키텍처를 공유한다.

**핵심 구조**

- `offsetRef` — 현재 누적 이동량(px). React state가 아닌 ref로 관리해 렌더를 일으키지 않음
- `snapIdxRef` — 현재 snap된 카드 인덱스
- `cardRefs` — `Map<pi, HTMLDivElement>`. DOM을 직접 조작해 `style.transform`을 업데이트
- `renderIdx` (state) — 렌더링할 카드 윈도우 결정용. `[renderIdx-1, renderIdx, renderIdx+1, renderIdx+2]` 4장만 DOM에 존재
- `forceReflow()` — `transition:none → transition:Xms` 전환 시 브라우저가 같은 프레임으로 묶는 버그 방지. `el.offsetHeight` 참조로 강제 reflow 유발
- `getCardRef(pi)` — stable ref 콜백 캐시. inline arrow를 쓰면 매 렌더에 새 함수가 생겨 `null→el` 재호출이 transition을 캔슬함

**이벤트 등록 방식**

- `useEffect`에서 native listener로 직접 등록 (React synthetic event 사용 안 함)
- `touchmove`는 `passive: false`로 등록해 `e.preventDefault()`로 페이지 스크롤 차단
- `mousemove` / `mouseup`은 `window`에 등록해 요소 밖 드래그도 추적

**경계 감쇠**

- 첫 카드 위 / 마지막 카드 아래로 드래그 시 `delta *= 0.2` 적용

---

## 인터랙션 목록

### 1. 카드 스택 UI

- **slug** `card-stack-ui`
- **컴포넌트** `CardStackDemo.tsx`
- **방향** 수직 (Y축)
- **입력** 터치 드래그 / 마우스 드래그 / 마우스 휠 (rAF debounce)
- **핵심 상수**
  - `CARD_H = 514`, `PEEK = 20` (다음 카드 핸들만 노출)
  - `THRESHOLD = 70px` (전환 임계값)
  - `ANIM_MS = 360ms`, easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
  - `MAX_SHRINK_Y = 120px` → scale 최대 0.8까지 축소
- **scale 계산** `getScaleFromTy(ty)` — ty가 음수(위로 올라간 카드)일수록 shrink
- **비고** 카드 자체가 인터랙션 설명 콘텐츠 (드래그 방식, 임계값, 감쇠 안내)

---

### 2. 컬러 카드 스택

- **slug** `color-card-stack`
- **컴포넌트** `ColorCardStackDemo.tsx`
- **방향** 수직 (Y축)
- **입력** 터치 드래그 / 마우스 드래그 / 마우스 휠
- **핵심 상수**
  - `CARD_H = 460`, `PEEK = 20`
  - `THRESHOLD = 70px`, `ANIM_MS = 360ms`
- **비고** CardStackDemo의 단순화 버전. 카드 내부 콘텐츠 없이 단색 배경 3장. 경계 snap 시 반드시 원위치로 돌아옴 (범위 초과 go() 대신 원위치 snap)

---

### 3. 좌우 카드 스와이프

- **slug** `horizontal-card-swipe`
- **컴포넌트** `HorizontalCardSwipeDemo.tsx`
- **방향** 수평 (X축)
- **입력** 터치 드래그 / 마우스 드래그 / 키보드 ← →
- **핵심 상수**
  - `CARD_W = 300`, `PEEK = 24` (다음 카드 오른쪽 24px 노출)
  - `THRESHOLD = 60px`, `ANIM_MS = 320ms`
  - scale: `getScaleFromTx(tx)` — 오른쪽으로 밀릴수록 최대 8% shrink
- **비고** `tabIndex={0}` + keydown 리스너로 키보드 접근성 지원

---

### 4. 양옆 카드 스와이프

- **slug** `centered-card-swipe`
- **컴포넌트** `CenteredCardSwipeDemo.tsx`
- **방향** 수평 (X축)
- **입력** 터치 드래그 / 마우스 드래그 / 키보드 ← →
- **핵심 상수**
  - `CARD_SLOT = 252` (카드 너비 + 갭), `GAP = 12`, `CARD_VW = 240`
  - `SIDE_PEEK_OFFSET = 40` → 양옆 카드 28px씩 노출
  - `W_CONTAINER = 320` (2×40 + 240)
  - `THRESHOLD = 60px`, `ANIM_MS = 320ms`
- **scale 계산** 현재 카드 위치(SIDE_PEEK_OFFSET)에서 벗어날수록 최대 10% shrink
- **offset 공식** `SIDE_PEEK_OFFSET - snapIdx * CARD_SLOT`

---

### 5. 지갑 카드 스택

- **slug** `wallet-card`
- **컴포넌트** `WalletCardDemo.tsx`
- **입력** 마우스 호버 / 클릭(pinned 토글)
- **상태** `hovered` + `pinned` → `open = hovered || pinned`
- **핵심 상수**
  - `PEEK_REST = 18px` (닫힌 상태 카드 헤더 노출), `PEEK_OPEN = 62px` (열린 상태)
  - `ANIM_MS = 380ms`, easing `cubic-bezier(0.34, 1.4, 0.64, 1)` (과탄성)
- **카드 위치** `FRONT_TOP - pos * (open ? PEEK_OPEN : PEEK_REST)` — pos=0이 앞 카드(하단)

---

### 6. 지갑 카드 스택 2

- **slug** `wallet-card-2`
- **컴포넌트** `WalletCardDemo2.tsx`
- **입력** 개별 카드 마우스 호버
- **상태** `hoveredCard: number | null`
- **핵심 상수**
  - `PEEK_REST = 18px`, `HOVER_LIFT = 28px`
  - `ANIM_MS = 300ms`, easing `cubic-bezier(0.34, 1.4, 0.64, 1)`
- **카드 위치** 기본 `FRONT_TOP - i * PEEK_REST`, 호버 시 추가로 `HOVER_LIFT` 만큼 올라감
- **비고** 첫 카드(pos=0)는 제자리 고정. transform scale(1.06)도 함께 적용

---

### 7. 마이크로 인터랙션

- **slug** `micro-interaction`
- **컴포넌트** `MicroInteractionDemo.tsx`
- **현황** 현재 빈 컴포넌트 (`return <div />`) — 미구현 상태

---

### 8. 물리 하트 + 바텀시트

- **slug** `physics-heart`
- **컴포넌트** `PhysicsHeartDemo.tsx`
- **입력** 할일 체크 클릭 / 바텀시트 드래그 (포인터 이벤트)
- **물리 엔진** `requestAnimationFrame` 루프. 매 프레임 `vy += 0.2` (중력), opacity < 0이거나 y > 420이면 제거
- **바텀시트**
  - `sheetY` state (0 = 완전 열림, `SHEET_FULL = 340` = 닫힘)
  - `dragging` state + `pointermove/pointerup` window 이벤트
  - snap 기준: 드래그 거리 > 60px 또는 최종 위치 < `SHEET_FULL/2`이면 열림
  - transition: `dragging ? 'none' : '0.35s cubic-bezier(0.34, 1.4, 0.64, 1)'`
- **하트 생성** 체크 완료 시 `spawnHeart()`, 체크 해제 시 `removeHeart()`

---

### 9. 온보딩 슬라이더

- **slug** `onboarding-slider`
- **컴포넌트** `OnboardingSliderDemo.tsx`
- **입력** 스와이프 (포인터 이벤트, threshold 50px) / 인디케이터 클릭 / 이전·다음 버튼
- **자동재생** `setTimeout` 3500ms. 인터랙션마다 `resetTimer()`로 재시작
- **슬라이드 전환** CSS `transition: background Xms ease`로 배경 그라디언트만 전환. 텍스트는 즉시 교체
- **슬라이드** 3장 (스마트 플래너 / 한눈에 비교 / 완벽한 하루)

---

### 10. 뷰 토글

- **slug** `view-toggle`
- **컴포넌트** `ViewToggleDemo.tsx`
- **입력** 캡슐 토글 버튼 클릭
- **상태** `view: 'event' | 'schedule'`
- **캡슐 슬라이더** 절대 위치로 배치. `left: value === 'event' ? 3 : 'calc(50% + 1px)'` CSS transition으로 이동
- **뷰 데이터** 행사(팀 발표, 팀 워크샵) / 일정(디자인 리뷰, 기획 미팅, 스튜디오 투어)

---

### 11. 가격 범위 슬라이더

- **slug** `price-range-slider`
- **컴포넌트** `PriceRangeSliderDemo.tsx`
- **입력** `<input type="range">` (네이티브)
- **로그 스케일** `MARKS` 배열 19단계 (10, 20, 30, ..., 100, 200, ..., 1000만원). 인덱스로 접근해 균등 간격처럼 보임
- **말풍선 위치** `ResizeObserver`로 트랙 너비 변화 감지 → `bubbleLeft` px 재계산. `computeBubble()`이 `useCallback`으로 메모이즈
- **thumb 시각화** 실제 range input은 `opacity: 0`, 커스텀 thumb div를 `left: calc(${pct}% - 14px)`로 동기화
- **선택 전 상태** `selected = false` → fill 없음, thumb 회색, 안내 텍스트 표시

---

### 12. 칩 필터

- **slug** `chip-filter`
- **컴포넌트** `ChipFilterDemo.tsx`
- **입력** 칩 버튼 클릭
- **상태** 지역(단일) `selectedArea: string | null` / 스타일(다중) `selectedStyles: string[]` / 수용인원(단일) `selectedCap: string | null`
- **필터 수 집계** `(selectedArea ? 1 : 0) + selectedStyles.length + (selectedCap ? 1 : 0)`
- **초기화** 한 번에 전체 리셋

---

### 13. 카테고리 Dimming

- **slug** `category-dimming`
- **컴포넌트** `CategoryDimmingDemo.tsx`
- **입력** 카테고리 버튼 클릭 (토글)
- **상태** `selected: string | null`
- **Dimming 효과** 선택된 것 외 카드에 `opacity: 0.45` + `filter: grayscale(70%)`. CSS transition `all 0.2s`
- **카테고리** 카페 ☕ / 음식점 🍽️ / 쇼핑 🛍️ / 전시 🎨

---

### 14. 실시간 알림 SSE

- **slug** `notification-sse`
- **컴포넌트** `NotificationSSEDemo.tsx`
- **시뮬레이션** `setInterval` 2500ms마다 `MOCK_MESSAGES` 순환 push. 최대 10개 유지
- **실제 구현 설명** fetch + ReadableStream으로 Bearer 토큰 SSE 구독, 최대 5회 자동 재연결
- **상태** `connected: boolean` / `notifications: Notification[]`
- **알림 타입** reserve(초록) / review(노랑) / system(보라) — 컬러 배지로 구분
- **연결/해제** 버튼 클릭. `connect()` 800ms 핸드셰이크 시뮬레이션 후 interval 시작

---

### 15. 회원가입 Wizard

- **slug** `signup-wizard`
- **컴포넌트** `SignupWizardDemo.tsx`
- **단계** Step 1 약관 동의 → Step 2 본인확인 → Step 3 추가정보
- **StepIndicator** 각 스텝 `flex: 1` 컬럼. 커넥터 라인은 절대 위치 `top: 13px` (서클 28px 중앙). 좌측 절반은 `done || active`, 우측 절반은 `done` 조건으로 색상 분기
- **Step 1** 전체 동의 + 개별 동의. `canNext1 = t1 && t2 && t3` (선택 항목 mkt 제외)
- **Step 2** 이름 2자 이상 + 전화번호 10자리 + 인증번호 6자리 모두 충족 시 통과. 인증번호 6자리 입력 시 자동으로 `verified = true`
- **Step 3** 이메일 `@` 포함 + 비밀번호 8자 이상

---

### 16. 무한 스크롤

- **slug** `infinite-scroll`
- **컴포넌트** `InfiniteScrollDemo.tsx`
- **트리거** `IntersectionObserver` — sentinel div(`height: 1px`)가 viewport에 진입 시 `loadMore()` 호출
- **페이지네이션** 5개씩 추가. `page >= 4`이면 `hasMore = false`
- **카테고리 전환** `switchCategory()` 호출 시 items/page 초기화
- **로딩 딜레이** `setTimeout 700ms` 시뮬레이션
- **카테고리** 카페 / 음식점 / 쇼핑 / 전시 (카페·전시는 CAFE_DATA, 음식점·쇼핑은 FOOD_DATA)
- **비고** `pageRef.current`를 별도 ref로 관리 — closure stale 방지

---

### 17. 자동저장 (이중 레이어)

- **slug** `auto-save`
- **컴포넌트** `AutoSaveDemo.tsx`
- **Layer 1** `500ms debounce` — 입력 후 500ms 뒤 `localStorage.setItem`
- **Layer 2** `pagehide` 이벤트 flush — 탭 닫기·새로고침 직전 즉시 저장
- **드래프트 복원** 마운트 시 `localStorage` 확인. 값 있으면 `status = 'conflict'` 3초 표시 후 idle
- **상태** `'idle' | 'saving' | 'saved' | 'conflict'`
- **저장 키** `'yerim-blog:autosave-demo'`
- **비고** `localLoaded` flag — 초기 로드 전엔 useEffect에서 scheduleSave 호출 안 함

---

### 18. 필터 선택 UI

- **slug** `dress-fitting`
- **컴포넌트** `DressFittingDemo.tsx`
- **입력** pill 버튼 클릭
- **상태** 컬러(다중) `colors: string[]` / 스타일(단일) `style: string | null` / 핏(단일) `fit: string | null`
- **저장 가능 조건** `style !== null && fit !== null`
- **pill 스타일** active: `border #7c3aed + bg #ede9fe + color #7c3aed`. inactive: var(--border) + var(--surface)

---

### 19. 검색바 + 알림 배지

- **slug** `search-bar-badge`
- **컴포넌트** `SearchBarBadgeDemo.tsx`
- **상태** `notifications: { id, text, read }[]` / `unread` (useEffect 연산)
- **배지** `unread > 0`이면 종 아이콘이 filled 보라색으로 교체 + 숫자 배지
- **패널** 종 클릭으로 토글. 항목 클릭 시 read 처리. '모두 읽기' 버튼 제공
- **알림 추가** 버튼으로 동적 추가 가능

---

### 20. 배너 캐러셀

- **slug** `banner-carousel`
- **컴포넌트** `BannerCarouselDemo.tsx`
- **입력** 스와이프 (포인터 이벤트, threshold 50px) / 도트 클릭 / ← → 버튼
- **자동재생** `setTimeout 4000ms`. `resetTimer()`로 인터랙션마다 재시작
- **전환 효과** CSS `transition: background 0.5s ease`로 배경 그라디언트 전환
- **진행 바** `@keyframes banner-progress`로 `width: 0% → 100%` 애니메이션. `key={idx}`로 슬라이드 전환마다 재시작
- **GPU 가속** `willChange: 'transform'` + `transform: 'translateZ(0)'`
- **배너** 트렌드 리포트 / 신규 컴포넌트 / 포트폴리오 갤러리 / 인기 아티클

---

### 21. 마이페이지 탭

- **slug** `my-tabs`
- **컴포넌트** `MyTabsDemo.tsx`
- **상태** `tab: 'reserve' | 'review' | 'saved'`
- **강조선** 활성 탭에 절대 위치 `bottom: -2, height: 2, background: #7c3aed` div
- **탭 데이터**
  - reserve: 레스토랑 / 미술관 / 공연 예약
  - review: 카페·레스토랑·갤러리 별점
  - saved: 즐겨찾기 / 저장 항목

### 22. 하트 쌓기

- **slug** `drop-heart-stack`
- **컴포넌트** `DropHeartStackDemo.tsx`
- **물리 엔진** 커스텀 impulse 기반 (Matter.js 미사용)
- **주요 상수**
  - `R = 22` (반지름), `G = 0.5` (중력), `RESTITUTION = 0.28` (반발계수)
  - `DAMPING = 0.985` (공기저항), `FLOOR_MU = 0.30` (바닥 마찰)
  - `SLOP = 0.6` (침투 허용 깊이 — jitter 방지), `CORR_PCT = 0.40` (위치 보정 강도)
  - `ITERATIONS = 6` (반복 solver 횟수), `SLEEP_V = 0.08`, `SLEEP_FRAMES = 28`
- **상태 관리** `itemsRef` (Ref 직접 변이) + `setRenderKey(k => k+1)` (리렌더 트리거)
- **Sleep 패턴** 속도 < SLEEP_V 가 SLEEP_FRAMES 프레임 연속 → `sleeping = true` (정적 바디, inv_mass=0)
- **충돌 해석** `solveCollisions()` — 바닥·벽 경계 + 원-원 impulse + positional correction
- **제한** MAX_ITEMS = 500, 초기화 버튼, 정착 진행 바 표시

---

## 파일 경로 정리

| 컴포넌트 파일                 | slug                    | 상태                     |
| ----------------------------- | ----------------------- | ------------------------ |
| `CardStackDemo.tsx`           | `card-stack-ui`         | 완성                     |
| `ColorCardStackDemo.tsx`      | `color-card-stack`      | 완성                     |
| `HorizontalCardSwipeDemo.tsx` | `horizontal-card-swipe` | 완성                     |
| `CenteredCardSwipeDemo.tsx`   | `centered-card-swipe`   | 완성                     |
| `WalletCardDemo.tsx`          | `wallet-card`           | 완성                     |
| `WalletCardDemo2.tsx`         | `wallet-card-2`         | 완성                     |
| `MicroInteractionDemo.tsx`    | `micro-interaction`     | **미구현** (빈 컴포넌트) |
| `PhysicsHeartDemo.tsx`        | `physics-heart`         | 완성                     |
| `OnboardingSliderDemo.tsx`    | `onboarding-slider`     | 완성                     |
| `ViewToggleDemo.tsx`          | `view-toggle`           | 완성                     |
| `PriceRangeSliderDemo.tsx`    | `price-range-slider`    | 완성                     |
| `ChipFilterDemo.tsx`          | `chip-filter`           | 완성                     |
| `CategoryDimmingDemo.tsx`     | `category-dimming`      | 완성                     |
| `NotificationSSEDemo.tsx`     | `notification-sse`      | 완성                     |
| `SignupWizardDemo.tsx`        | `signup-wizard`         | 완성                     |
| `InfiniteScrollDemo.tsx`      | `infinite-scroll`       | 완성                     |
| `AutoSaveDemo.tsx`            | `auto-save`             | 완성                     |
| `DressFittingDemo.tsx`        | `dress-fitting`         | 완성                     |
| `SearchBarBadgeDemo.tsx`      | `search-bar-badge`      | 완성                     |
| `BannerCarouselDemo.tsx`      | `banner-carousel`       | 완성                     |
| `MyTabsDemo.tsx`              | `my-tabs`               | 완성                     |
| `DropHeartStackDemo.tsx`      | `drop-heart-stack`      | 완성                     |
