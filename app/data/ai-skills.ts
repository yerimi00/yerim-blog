export interface AiSkillVariant {
  name: string
  description: string
  command: string
}

export interface AiSkill {
  name: string
  description: string
  command: string
  variants?: AiSkillVariant[]
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
        description: '세션을 마무리할 때 한 일, 배운 점, 막힌 점을 자동으로 정리해 마크다운으로 남깁니다. 대화가 길어져서 뭘 했는지 다시 찾아보기 힘들 때 씁니다.',
        command: '/session-wrap',
      },
      {
        name: 'daily-wrap',
        description: '하루 동안 쌓인 세션 기록을 모아 반복되는 패턴과 자동화할 만한 작업을 찾아냅니다. 하루 마무리에 한 번 돌립니다.',
        command: '/daily-wrap',
      },
    ],
  },
  {
    title: '코드 품질',
    skills: [
      {
        name: 'ponytail',
        description: '가장 단순하고 게으른 해법을 우선하도록 강제하는 코드 스타일 원칙(YAGNI, 표준 라이브러리 우선). 과설계가 의심될 때 켭니다. 하위 명령이 여러 개라 눌러서 확인할 수 있습니다.',
        command: 'ponytail',
        variants: [
          {
            name: 'ponytail',
            description: '기본 모드. 코딩 작업 전반에서 최소 구현·표준 라이브러리 우선을 강제합니다.',
            command: 'ponytail',
          },
          {
            name: 'ponytail-review',
            description: '과잉설계만 짚어내는 코드 리뷰입니다. 정확성 리뷰는 하지 않습니다.',
            command: '과잉설계 리뷰해줘',
          },
          {
            name: 'ponytail-audit',
            description: '레포 전체를 훑어 과잉설계된 부분을 감사 리포트로 정리합니다.',
            command: '이 코드베이스 감사해줘',
          },
          {
            name: 'ponytail-debt',
            description: '코드 안에 남겨둔 `ponytail:` 주석(의도적으로 미룬 타협)을 모아 목록화합니다.',
            command: 'ponytail debt',
          },
          {
            name: 'ponytail-gain',
            description: '벤치마크 기준으로 얼마나 코드가 줄고 효율이 오르는지 요약해서 보여줍니다.',
            command: 'ponytail gain',
          },
          {
            name: 'ponytail-help',
            description: '전체 명령어를 한눈에 볼 수 있는 빠른 참고 카드입니다.',
            command: 'ponytail help',
          },
        ],
      },
      {
        name: 'code-review',
        description: '변경된 코드의 정확성과 재사용성·효율성을 기준으로 리뷰합니다. 커밋·PR 올리기 전에 씁니다.',
        command: '/code-review',
      },
      {
        name: 'security-review',
        description: '변경 사항에 보안 취약점이 있는지 점검합니다. 인증·입력값 처리 코드를 건드렸을 때 씁니다.',
        command: '/security-review',
      },
    ],
  },
  {
    title: '문서·데이터 자동화',
    skills: [
      {
        name: 'docx / pptx / xlsx / pdf',
        description: '대화만으로 Word·PowerPoint·Excel·PDF 문서를 생성하고 편집합니다. 보고서나 발표자료를 빠르게 초안 잡을 때 씁니다.',
        command: '이 내용으로 워드 문서 만들어줘',
      },
      {
        name: 'dataviz',
        description: '차트와 대시보드를 일관된 톤으로 설계하기 위한 가이드를 따릅니다. 데이터 시각화가 필요할 때마다 자동으로 적용됩니다.',
        command: '이 데이터로 차트 그려줘',
      },
    ],
  },
  {
    title: '워크플로우 관리',
    skills: [
      {
        name: 'update-config',
        description: '훅, 권한, 환경 변수 같은 설정을 대화로 관리합니다. Claude Code 세팅을 바꿀 때마다 직접 JSON을 만지는 대신 씁니다.',
        command: '커밋 전에 항상 린트 돌리는 훅 추가해줘',
      },
      {
        name: 'schedule / loop',
        description: '반복 작업을 예약하거나 일정 주기로 실행되도록 자동화합니다. 매일/매주 반복되는 확인 작업에 씁니다.',
        command: '매일 아침 9시에 이 작업 실행되게 예약해줘',
      },
    ],
  },
]
