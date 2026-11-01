'use client'

import { useState } from 'react'
import { Reorder, motion } from 'motion/react'
import type { OrderData } from '@/lib/interview-widgets'
import { fastTween } from '@/components/motion/presets'
import WidgetFrame, { Explain, WidgetButton } from './WidgetFrame'

// 서버·클라이언트가 같은 순서를 내야 해서(하이드레이션) 랜덤 대신 고정된 섞기: 뒤집고 한 칸 회전
function scramble(items: string[]): string[] {
  const reversed = [...items].reverse()
  return items.length <= 2 ? reversed : [...reversed.slice(1), reversed[0]]
}

// 카드를 끌어서 올바른 순서로 배치한 뒤 확인한다
export default function OrderWidget({ data }: { data: OrderData }) {
  const [order, setOrder] = useState(() => scramble(data.items))
  const [checked, setChecked] = useState(false)
  const correctCount = order.filter((item, i) => item === data.items[i]).length

  return (
    <WidgetFrame type="order">
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 0.75rem' }}>카드를 끌어서 올바른 순서로 맞춰 보세요</p>
      <Reorder.Group axis="y" values={order} onReorder={checked ? () => {} : setOrder} style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {order.map((item, i) => {
          const ok = item === data.items[i]
          return (
            <Reorder.Item
              key={item}
              value={item}
              drag={checked ? false : 'y'}
              whileDrag={{ scale: 1.02, boxShadow: 'var(--shadow-floating)' }}
              initial={false}
              animate={{ borderColor: checked ? (ok ? 'var(--success)' : 'var(--accent)') : 'var(--border)' }}
              transition={fastTween}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                borderWidth: 2,
                borderStyle: 'solid',
                background: 'var(--surface)',
                cursor: checked ? 'default' : 'grab',
                userSelect: 'none',
                fontSize: '0.9rem',
                color: 'var(--text)',
              }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{i + 1}</span>
              <span style={{ flex: 1 }}>{item}</span>
              {checked ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: ok ? 'var(--success)' : 'var(--accent)', fontWeight: 700 }}>
                  {ok ? '✓' : '✕'}
                </motion.span>
              ) : (
                <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>⠿</span>
              )}
            </Reorder.Item>
          )
        })}
      </Reorder.Group>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <WidgetButton primary disabled={checked} onClick={() => setChecked(true)}>확인</WidgetButton>
        {checked && <WidgetButton onClick={() => { setChecked(false); setOrder(scramble(data.items)) }}>다시 풀기</WidgetButton>}
      </div>
      {checked && (
        <Explain correct={correctCount === data.items.length}>
          {correctCount}/{data.items.length}개 위치가 맞아요. {data.explain}
        </Explain>
      )}
    </WidgetFrame>
  )
}
