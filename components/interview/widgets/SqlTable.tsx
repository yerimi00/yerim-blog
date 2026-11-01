'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import type { SqlTableData } from '@/lib/interview-widgets'
import TabButton from '@/components/motion/TabButton'
import WidgetFrame, { WidgetButton } from './WidgetFrame'

const cell: React.CSSProperties = { padding: '0.45rem 0.75rem', borderBottom: '1px solid var(--border)', fontSize: '0.84rem', textAlign: 'left', color: 'var(--text)' }
const head: React.CSSProperties = { ...cell, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--bg-secondary)' }

function Table({ columns, rows, animate }: { columns: string[]; rows: (string | number)[][]; animate?: boolean }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>{columns.map((c) => <th key={c} style={head}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={i}
              initial={animate ? { opacity: 0, x: -8 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animate ? i * 0.12 : 0 }}
            >
              {row.map((v, j) => <td key={j} style={cell}>{String(v)}</td>)}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 작은 테이블에 쿼리를 골라 실행하면 결과 행이 하나씩 나타난다
export default function SqlTable({ data }: { data: SqlTableData }) {
  const [q, setQ] = useState(0)
  const [ran, setRan] = useState(false)
  const query = data.queries[q]
  // 결과 열 이름은 SELECT 절에서 뽑는다 (없으면 첫 테이블 열)
  const select = query.sql.match(/select\s+([\s\S]+?)\s+from/i)?.[1]
  const resultColumns = select ? select.split(',').map((s) => s.trim()) : data.tables[0].columns

  return (
    <WidgetFrame type="sql_table">
      {data.tables.map((t) => (
        <div key={t.name} style={{ marginBottom: '1rem' }}>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>테이블: {t.name}</p>
          <Table columns={t.columns} rows={t.rows} />
        </div>
      ))}

      <div className="series-tab-bar" style={{ marginBottom: '0.75rem' }}>
        {data.queries.map((_, i) => (
          <TabButton key={i} active={q === i} onClick={() => { setQ(i); setRan(false) }}>
            쿼리 {i + 1}
          </TabButton>
        ))}
      </div>
      <pre style={{ margin: '0 0 0.75rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
        <code>{query.sql}</code>
      </pre>
      <WidgetButton primary disabled={ran} onClick={() => setRan(true)}>▶ 실행</WidgetButton>

      {ran && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>결과 ({query.result_rows.length}행)</p>
          <Table key={q} columns={resultColumns} rows={query.result_rows} animate />
        </div>
      )}
    </WidgetFrame>
  )
}
