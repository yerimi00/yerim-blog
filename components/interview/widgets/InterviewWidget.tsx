import type { Widget } from '@/lib/interview-widgets'
import PredictOutput from './PredictOutput'
import OrderWidget from './OrderWidget'
import StepDiagram from './StepDiagram'
import CompareToggle from './CompareToggle'
import OxQuiz from './OxQuiz'
import SqlTable from './SqlTable'

// 문제의 위젯 타입에 맞는 컴포넌트를 고른다
export default function InterviewWidget({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'predict_output':
      return <PredictOutput data={widget.data} />
    case 'order':
      return <OrderWidget data={widget.data} />
    case 'step_diagram':
      return <StepDiagram data={widget.data} />
    case 'compare_toggle':
      return <CompareToggle data={widget.data} />
    case 'ox_quiz':
      return <OxQuiz data={widget.data} />
    case 'sql_table':
      return <SqlTable data={widget.data} />
  }
}
