import type { ComponentType } from 'react'
import CardStackDemo from '@/components/blog/CardStackDemo'
import ColorCardStackDemo from '@/components/blog/ColorCardStackDemo'
import HorizontalCardSwipeDemo from '@/components/blog/HorizontalCardSwipeDemo'
import CenteredCardSwipeDemo from '@/components/blog/CenteredCardSwipeDemo'
import WalletCardDemo from '@/components/blog/WalletCardDemo'
import WalletCardDemo2 from '@/components/blog/WalletCardDemo2'
import PhysicsHeartDemo from '@/components/blog/PhysicsHeartDemo'
import OnboardingSliderDemo from '@/components/blog/OnboardingSliderDemo'
import ViewToggleDemo from '@/components/blog/ViewToggleDemo'
import PriceRangeSliderDemo from '@/components/blog/PriceRangeSliderDemo'
import ChipFilterDemo from '@/components/blog/ChipFilterDemo'
import CategoryDimmingDemo from '@/components/blog/CategoryDimmingDemo'
import NotificationSSEDemo from '@/components/blog/NotificationSSEDemo'
import SignupWizardDemo from '@/components/blog/SignupWizardDemo'
import InfiniteScrollDemo from '@/components/blog/InfiniteScrollDemo'
import AutoSaveDemo from '@/components/blog/AutoSaveDemo'
import DressFittingDemo from '@/components/blog/DressFittingDemo'
import SearchBarBadgeDemo from '@/components/blog/SearchBarBadgeDemo'
import BannerCarouselDemo from '@/components/blog/BannerCarouselDemo'
import MyTabsDemo from '@/components/blog/MyTabsDemo'
import DropHeartStackDemo from '@/components/blog/DropHeartStackDemo'
import MagneticButtonDemo from '@/components/blog/MagneticButtonDemo'
import DragToReorderDemo from '@/components/blog/DragToReorderDemo'

export type DemoMeta = { title: string; description: string }

export const DEMOS: Record<string, DemoMeta> = {
  'card-stack-ui':        { title: '카드 스택 UI',          description: '드래그 또는 스크롤로 카드를 넘기는 수직 스택 인터랙션' },
  'color-card-stack':     { title: '컬러 카드 스택',        description: '3가지 색상 카드로 구현한 수직 스택 인터랙션' },
  'horizontal-card-swipe':{ title: '좌우 카드 스와이프',    description: '드래그로 카드를 좌우로 전환하는 수평 스와이프 인터랙션' },
  'centered-card-swipe':  { title: '양옆 카드 스와이프',    description: '현재 카드를 중앙에 두고 양옆 카드가 살짝 보이는 캐러셀 인터랙션' },
  'wallet-card':          { title: '지갑 카드 스택',        description: '카드를 위로 드래그해 지갑에서 꺼내는 겹침 스택 인터랙션' },
  'wallet-card-2':        { title: '지갑 카드 스택 2',      description: '호버·클릭으로 카드가 위로 펼쳐지는 지갑 스택 인터랙션' },
  'physics-heart':        { title: '물리 하트 + 바텀시트',  description: '할일 완료 시 물리 엔진 기반 하트가 떨어지는 인터랙션 + 드래그 바텀시트' },
  'onboarding-slider':    { title: '온보딩 슬라이더',       description: '3단계 온보딩 슬라이더. 3.5초 자동재생, 스와이프·인디케이터 클릭 연동' },
  'view-toggle':          { title: '뷰 토글',               description: '슬라이딩 캡슐 토글로 두 뷰를 전환하는 Controlled/Uncontrolled 패턴' },
  'price-range-slider':   { title: '가격 범위 슬라이더',    description: '10~1000만원 로그 스케일 19단계 슬라이더. 말풍선 위치 동적 계산 + ResizeObserver' },
  'chip-filter':          { title: '칩 필터',               description: '단일 선택과 다중 선택을 지원하는 검색 필터 칩 그룹' },
  'category-dimming':     { title: '카테고리 Dimming',      description: '카테고리 선택 시 나머지를 grayscale + opacity로 흐리게 처리하는 인터랙션' },
  'notification-sse':     { title: '실시간 알림 (SSE)',     description: 'fetch + ReadableStream으로 구현한 SSE 실시간 알림. 자동 재연결 내장' },
  'signup-wizard':        { title: '회원가입 Wizard',       description: '약관 동의 → 본인확인 → 추가정보 3단계 멀티스텝 폼' },
  'infinite-scroll':      { title: '무한 스크롤',           description: 'IntersectionObserver 기반 무한 스크롤. 카테고리별 분기 + 페이지네이션' },
  'auto-save':            { title: '자동저장 (이중 레이어)',description: '10s 디바운스 + pagehide flush 이중 자동저장. 카운트다운 바로 디바운스 상태 시각화' },
  'dress-fitting':        { title: '필터 선택 UI',          description: '다중 선택 + 단일 선택 pill 인터랙션' },
  'search-bar-badge':     { title: '검색바 + 알림 배지',    description: '알림 미확인 수에 따라 아이콘이 바뀌는 검색바 + 알림 패널' },
  'banner-carousel':      { title: '배너 캐러셀',           description: '7초 자동재생 배너. 진행 바 애니메이션, 스와이프 지원, GPU 가속' },
  'my-tabs':              { title: '마이페이지 탭',         description: '하단 강조선이 애니메이션되는 탭 전환 UI' },
  'drop-heart-stack':     { title: '하트 쌓기',             description: '버튼을 누르면 아이콘 원형 아이템이 떨어져 물리 기반으로 쌓이는 인터랙션' },
  'magnetic-button':      { title: '마그네틱 버튼',         description: '마우스가 가까워지면 버튼이 반대 방향으로 도망치는 인터랙션' },
  'drag-to-reorder':      { title: 'Drag to Reorder',       description: '리스트 아이템을 드래그해 순서를 바꾸는 인터랙션. 고스트 + 슬롯 애니메이션' },
}

export const DEMO_COMPONENTS: Record<string, ComponentType> = {
  'card-stack-ui':         CardStackDemo,
  'color-card-stack':      ColorCardStackDemo,
  'horizontal-card-swipe': HorizontalCardSwipeDemo,
  'centered-card-swipe':   CenteredCardSwipeDemo,
  'wallet-card':           WalletCardDemo,
  'wallet-card-2':         WalletCardDemo2,
  'physics-heart':         PhysicsHeartDemo,
  'onboarding-slider':     OnboardingSliderDemo,
  'view-toggle':           ViewToggleDemo,
  'price-range-slider':    PriceRangeSliderDemo,
  'chip-filter':           ChipFilterDemo,
  'category-dimming':      CategoryDimmingDemo,
  'notification-sse':      NotificationSSEDemo,
  'signup-wizard':         SignupWizardDemo,
  'infinite-scroll':       InfiniteScrollDemo,
  'auto-save':             AutoSaveDemo,
  'dress-fitting':         DressFittingDemo,
  'search-bar-badge':      SearchBarBadgeDemo,
  'banner-carousel':       BannerCarouselDemo,
  'my-tabs':               MyTabsDemo,
  'drop-heart-stack':      DropHeartStackDemo,
  'magnetic-button':       MagneticButtonDemo,
  'drag-to-reorder':       DragToReorderDemo,
}
