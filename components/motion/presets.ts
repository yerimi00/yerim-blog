// 사이트 공통 모션 값. 인터랙션·애니메이션은 motion(JS)으로 처리하고 이 값을 재사용한다
export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const

export const duration = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
} as const

export const spring = {
  snappy: { type: 'spring', stiffness: 500, damping: 34 },
  soft: { type: 'spring', stiffness: 220, damping: 26 },
  bouncy: { type: 'spring', stiffness: 400, damping: 15 },
} as const

// 호버·포커스 색 전환용
export const fastTween = { duration: duration.fast, ease: 'easeOut' } as const

// 아래에서 떠오르며 등장
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: ease.out } },
} as const
