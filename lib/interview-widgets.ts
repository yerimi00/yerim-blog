// 면접 문제 위젯 데이터. Notion 문제 본문의 "🎮 위젯 데이터 (타입)" 토글 안 JSON을 검증해 쓴다

export type PredictOutputData = { code: string; choices: string[]; answer_index: number; explain?: string }
export type OrderData = { items: string[]; explain?: string }
export type StepDiagramData = { steps: { from: string; to: string; label: string; desc?: string }[] }
export type CompareToggleData = {
  labels: [string, string]
  rows: { aspect: string; a: string; b: string }[]
  explain?: string
}
export type OxQuizData = { items: { statement: string; answer: boolean; explain?: string }[] }
export type SqlTableData = {
  tables: { name: string; columns: string[]; rows: (string | number)[][] }[]
  queries: { sql: string; result_rows: (string | number)[][] }[]
}

export type Widget =
  | { type: 'predict_output'; data: PredictOutputData }
  | { type: 'order'; data: OrderData }
  | { type: 'step_diagram'; data: StepDiagramData }
  | { type: 'compare_toggle'; data: CompareToggleData }
  | { type: 'ox_quiz'; data: OxQuizData }
  | { type: 'sql_table'; data: SqlTableData }

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
const isStr = (v: unknown): v is string => typeof v === 'string'
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr)
const isCell = (v: unknown) => isStr(v) || typeof v === 'number'
const isRows = (v: unknown) => Array.isArray(v) && v.every((r) => Array.isArray(r) && r.every(isCell))

// 타입별 최소 형태 검증. 맞지 않으면 null → 위젯 없이 페이지만 보여준다
export function parseWidget(type: string, raw: unknown): Widget | null {
  if (!isObj(raw)) return null
  switch (type) {
    case 'predict_output':
      return isStr(raw.code) && isStrArr(raw.choices) && typeof raw.answer_index === 'number' && raw.choices[raw.answer_index] !== undefined
        ? { type, data: raw as PredictOutputData }
        : null
    case 'order':
      return isStrArr(raw.items) && raw.items.length > 1 ? { type, data: raw as OrderData } : null
    case 'step_diagram':
      return Array.isArray(raw.steps) && raw.steps.length > 0 && raw.steps.every((s) => isObj(s) && isStr(s.from) && isStr(s.to) && isStr(s.label))
        ? { type, data: raw as StepDiagramData }
        : null
    case 'compare_toggle':
      return isStrArr(raw.labels) && raw.labels.length === 2 && Array.isArray(raw.rows) && raw.rows.every((r) => isObj(r) && isStr(r.aspect) && isStr(r.a) && isStr(r.b))
        ? { type, data: raw as CompareToggleData }
        : null
    case 'ox_quiz':
      return Array.isArray(raw.items) && raw.items.every((i) => isObj(i) && isStr(i.statement) && typeof i.answer === 'boolean')
        ? { type, data: raw as OxQuizData }
        : null
    case 'sql_table':
      return Array.isArray(raw.tables) && raw.tables.every((t) => isObj(t) && isStr(t.name) && isStrArr(t.columns) && isRows(t.rows)) &&
        Array.isArray(raw.queries) && raw.queries.every((q) => isObj(q) && isStr(q.sql) && isRows(q.result_rows))
        ? { type, data: raw as SqlTableData }
        : null
    default:
      return null
  }
}

const WIDGET_TOGGLE = /<details>\s*<summary>[^<]*위젯 데이터\s*\(([a-z_]+)\)[^<]*<\/summary>([\s\S]*?)<\/details>\s*/

// 본문 Markdown에서 위젯 토글을 떼어내고, 그 안의 JSON을 위젯으로 파싱한다
export function extractWidget(markdown: string): { content: string; widget: Widget | null } {
  const match = markdown.match(WIDGET_TOGGLE)
  if (!match) return { content: markdown, widget: null }
  const content = markdown.replace(WIDGET_TOGGLE, '')
  const json = match[2].match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]
  if (!json) return { content, widget: null }
  try {
    return { content, widget: parseWidget(match[1], JSON.parse(json)) }
  } catch {
    return { content, widget: null }
  }
}
