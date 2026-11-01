import { createElement, type ComponentType } from 'react'
import PredictOutput from '@/components/interview/widgets/PredictOutput'
import OrderWidget from '@/components/interview/widgets/OrderWidget'
import StepDiagram from '@/components/interview/widgets/StepDiagram'
import CompareToggle from '@/components/interview/widgets/CompareToggle'
import OxQuiz from '@/components/interview/widgets/OxQuiz'
import SqlTable from '@/components/interview/widgets/SqlTable'

// Lab 실험 목록. 새 데모는 components/에 만들고 여기에 slug로 등록한다
export type DemoMeta = { title: string; description: string }

export const DEMOS: Record<string, DemoMeta> = {
  'widget-predict-output': { title: '출력 예측', description: '코드를 보고 출력 순서를 고른 뒤 실행하면 콘솔에 한 줄씩 찍혀요. 면접 위젯 ①' },
  'widget-order': { title: '순서 맞히기', description: '카드를 끌어서 올바른 순서로 배치해요. 면접 위젯 ②' },
  'widget-step-diagram': { title: '단계별 흐름도', description: '"다음"을 누를 때마다 신호가 한 단계씩 이동해요. 면접 위젯 ③' },
  'widget-compare-toggle': { title: '비교 토글', description: 'A ↔ B 스위치로 같은 항목의 차이를 비교해요. 면접 위젯 ④' },
  'widget-ox-quiz': { title: 'OX 퀴즈', description: '흔한 오해를 O/X로 고르고 바로 해설을 봐요. 면접 위젯 ⑤' },
  'widget-sql-table': { title: 'SQL 실행해 보기', description: '작은 테이블에 쿼리를 실행하면 결과 행이 나타나요. 면접 위젯 ⑥' },
}

// 예시 데이터는 interview-question DB의 실제 문제에서 가져왔다 (비교 토글만 예시용)
export const DEMO_COMPONENTS: Record<string, ComponentType> = {
  'widget-predict-output': () =>
    createElement(PredictOutput, {
      data: {
        code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nqueueMicrotask(() => console.log('4'));\n(async () => { console.log('5'); await null; console.log('6'); })();\nconsole.log('7');",
        choices: ['1 7 5 3 4 6 2', '1 5 7 3 4 6 2', '1 5 7 2 3 4 6', '1 7 2 5 3 4 6'],
        answer_index: 1,
        explain: '동기(1,5,7) → 마이크로태스크(3,4,6) → 매크로태스크(2)',
      },
    }),
  'widget-order': () =>
    createElement(OrderWidget, {
      data: {
        items: ['클라이언트 → 서버: SYN (seq=x)', '서버 → 클라이언트: SYN+ACK (seq=y, ack=x+1)', '클라이언트 → 서버: ACK (ack=y+1)', '연결 성립 (ESTABLISHED)'],
        explain: '양쪽이 서로의 시퀀스 번호를 보내고 확인받으면 연결이 열려요',
      },
    }),
  'widget-step-diagram': () =>
    createElement(StepDiagram, {
      data: {
        steps: [
          { from: '공격자', to: 'Server Function 엔드포인트', label: '조작된 Flight 페이로드 전송', desc: '인증 없이 HTTP 요청 하나' },
          { from: '서버', to: 'React 역직렬화', label: 'Flight 데이터 복원', desc: '입력 검증이 부족한 지점' },
          { from: 'React 역직렬화', to: '서버 런타임', label: '공격자 코드 실행', desc: 'RCE 발생' },
          { from: '서버 런타임', to: '공격자', label: '환경변수·데이터 탈취 가능', desc: '서버 프로세스 권한 획득' },
        ],
      },
    }),
  'widget-compare-toggle': () =>
    createElement(CompareToggle, {
      data: {
        labels: ['CSR', 'SSR'],
        rows: [
          { aspect: 'HTML 생성', a: '브라우저가 JS를 실행해 만든다', b: '서버가 완성된 HTML을 보낸다' },
          { aspect: '첫 화면', a: 'JS 다운로드·실행 후 표시', b: '도착하자마자 표시' },
          { aspect: 'SEO', a: '크롤러가 빈 HTML을 볼 수 있다', b: '내용이 HTML에 있어 유리하다' },
          { aspect: '서버 부담', a: '정적 파일만 서빙', b: '요청마다 렌더링 비용' },
        ],
        explain: '첫 화면·SEO가 중요하면 SSR, 상호작용이 많은 앱 화면은 CSR이 유리해요',
      },
    }),
  'widget-ox-quiz': () =>
    createElement(OxQuiz, {
      data: {
        items: [
          { statement: 'READ COMMITTED에서는 더티 리드가 생기지 않는다', answer: true, explain: '커밋된 데이터만 읽어요' },
          { statement: 'SQL 표준의 REPEATABLE READ는 팬텀 리드를 막는다', answer: false, explain: '표준에서는 팬텀 리드를 허용해요' },
          { statement: 'InnoDB의 기본 격리 수준은 READ COMMITTED다', answer: false, explain: '기본값은 REPEATABLE READ예요' },
        ],
      },
    }),
  'widget-sql-table': () =>
    createElement(SqlTable, {
      data: {
        tables: [{ name: '주문', columns: ['고객', '금액'], rows: [['A', 3000], ['A', 7000], ['B', 2000], ['B', 1000], ['C', 9000]] }],
        queries: [
          { sql: 'SELECT 고객, SUM(금액) FROM 주문 WHERE 금액 >= 2000 GROUP BY 고객', result_rows: [['A', 10000], ['B', 2000], ['C', 9000]] },
          { sql: 'SELECT 고객, SUM(금액) FROM 주문 GROUP BY 고객 HAVING SUM(금액) >= 5000', result_rows: [['A', 10000], ['C', 9000]] },
        ],
      },
    }),
}
