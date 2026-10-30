// ActivityHeatmap 모션 값. 원본 패키지에 빠져 있어 사용하는 키만 정의
export const motionTokens = {
  ease: {
    enter: [0.16, 1, 0.3, 1],
    standard: [0.22, 1, 0.36, 1],
  },
  blur: {
    subtle: 2,
    soft: 4,
  },
  duration: {
    fast: 0.16,
  },
  spring: {
    snappy: { type: 'spring', stiffness: 520, damping: 38, mass: 0.8 },
    morph: { type: 'spring', stiffness: 380, damping: 34 },
  },
} as const
