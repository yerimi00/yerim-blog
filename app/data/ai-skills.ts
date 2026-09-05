export interface AiSkill {
  name: string
  description: string
}

export interface AiSkillCategory {
  title: string
  skills: AiSkill[]
}

export const aiSkillCategories: AiSkillCategory[] = [
  {
    title: '직접 만든 자동화',
    skills: [
      {
        name: 'session-wrap',
        description: '세션을 마무리할 때 한 일, 배운 점, 막힌 점을 자동으로 정리해 마크다운으로 남깁니다.',
      },
      {
        name: 'daily-wrap',
        description: '하루 동안 쌓인 세션 기록을 모아 반복되는 패턴과 자동화할 만한 작업을 찾아냅니다.',
      },
    ],
  },
  {
    title: '코드 품질',
    skills: [
      {
        name: 'ponytail',
        description: '가장 단순하고 게으른 해법을 우선하도록 강제하는 코드 스타일 원칙(YAGNI, 표준 라이브러리 우선).',
      },
      {
        name: 'code-review',
        description: '변경된 코드의 정확성과 재사용성·효율성을 기준으로 리뷰합니다.',
      },
      {
        name: 'security-review',
        description: '변경 사항에 보안 취약점이 있는지 점검합니다.',
      },
    ],
  },
  {
    title: '문서·데이터 자동화',
    skills: [
      {
        name: 'docx / pptx / xlsx / pdf',
        description: '대화만으로 Word·PowerPoint·Excel·PDF 문서를 생성하고 편집합니다.',
      },
      {
        name: 'dataviz',
        description: '차트와 대시보드를 일관된 톤으로 설계하기 위한 가이드를 따릅니다.',
      },
    ],
  },
  {
    title: '워크플로우 관리',
    skills: [
      {
        name: 'update-config',
        description: '훅, 권한, 환경 변수 같은 설정을 대화로 관리합니다.',
      },
      {
        name: 'schedule / loop',
        description: '반복 작업을 예약하거나 일정 주기로 실행되도록 자동화합니다.',
      },
    ],
  },
]
