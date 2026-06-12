'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { FiMenu, FiStar, FiHeart, FiBookmark, FiClock, FiTrendingUp } from 'react-icons/fi'
import type { IconType } from 'react-icons'

interface Item { id: number; label: string; Icon: IconType }

const INITIAL_ITEMS: Item[] = [
  { id: 1, label: '인기 게시글',  Icon: FiHeart },
  { id: 2, label: '즐겨찾기',     Icon: FiBookmark },
  { id: 3, label: '최근 본 항목', Icon: FiClock },
  { id: 4, label: '트렌딩',       Icon: FiTrendingUp },
  { id: 5, label: '추천',         Icon: FiStar },
]

const ITEM_H = 44
const GAP    = 4

interface DragState {
  id: number
  startIndex: number
  overIndex: number
  ghostY: number      // ghost div top (px, viewport)
  offsetY: number     // cursor - rowRect.top at drag start
  listTop: number
  listLeft: number
  listWidth: number
}

export default function DragToReorderDemo() {
  const [items, setItems]     = useState(INITIAL_ITEMS)
  const [dragState, setDs]    = useState<DragState | null>(null)

  // All refs used inside stable window event handlers
  const dsRef    = useRef<DragState | null>(null)
  const itemsRef = useRef(INITIAL_ITEMS)
  const listRef  = useRef<HTMLDivElement>(null)

  // Keep refs in sync with latest state/props
  dsRef.current    = dragState
  itemsRef.current = items

  /* ── window listeners (registered once) ── */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = dsRef.current
      if (!d) return
      e.preventDefault()

      const relY    = e.clientY - d.listTop
      const n       = itemsRef.current.length
      const newOver = Math.max(0, Math.min(n - 1, Math.floor(relY / (ITEM_H + GAP))))
      const next: DragState = {
        ...d,
        ghostY:    e.clientY - d.offsetY,
        overIndex: newOver,
      }
      dsRef.current = next
      setDs(next)
    }

    const onUp = () => {
      const d = dsRef.current
      if (!d) return
      if (d.startIndex !== d.overIndex) {
        setItems(prev => {
          const arr = [...prev]
          const [moved] = arr.splice(d.startIndex, 1)
          arr.splice(d.overIndex, 0, moved)
          return arr
        })
      }
      dsRef.current = null
      setDs(null)
    }

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup',   onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
  }, [])

  /* ── drag start ── */
  const onHandleDown = useCallback((e: React.PointerEvent, id: number) => {
    e.preventDefault()
    const list = listRef.current
    if (!list) return

    const handle  = e.currentTarget as HTMLElement
    const row     = handle.closest('[data-drag-row]') as HTMLElement | null
    if (!row) return

    const rowRect  = row.getBoundingClientRect()
    const listRect = list.getBoundingClientRect()
    const startIdx = itemsRef.current.findIndex(it => it.id === id)

    const d: DragState = {
      id,
      startIndex: startIdx,
      overIndex:  startIdx,
      ghostY:     rowRect.top,
      offsetY:    e.clientY - rowRect.top,
      listTop:    listRect.top,
      listLeft:   listRect.left,
      listWidth:  listRect.width,
    }
    dsRef.current = d
    setDs(d)
  }, [])

  /* ── visual helpers ── */
  const getShift = (idx: number): number => {
    if (!dragState) return 0
    const { startIndex: si, overIndex: oi } = dragState
    if (idx === si) return 0
    if (si < oi && idx > si && idx <= oi) return -(ITEM_H + GAP)
    if (si > oi && idx >= oi && idx < si) return  (ITEM_H + GAP)
    return 0
  }

  const draggedItem = dragState ? items.find(it => it.id === dragState.id) : null

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
        {items.map((item, i) => {
          const isDragging = dragState?.id === item.id
          return (
            <div
              key={item.id}
              data-drag-row
              onPointerDown={e => onHandleDown(e, item.id)}
              style={{
                height: ITEM_H,
                borderRadius: 'var(--radius-lg)',
                background: isDragging ? 'transparent' : 'var(--surface)',
                border: `1.5px ${isDragging ? 'dashed var(--border)' : 'solid var(--border-subtle)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '0 14px',
                opacity: isDragging ? 0.3 : 1,
                transform: `translateY(${getShift(i)}px)`,
                transition: dragState ? 'transform 0.15s ease' : 'none',
                userSelect: 'none',
                cursor: 'grab',
                touchAction: 'none',
                boxSizing: 'border-box',
              }}
            >
              <item.Icon size={14} color="var(--accent)" />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
              <FiMenu size={14} color="var(--border)" />
            </div>
          )
        })}
      </div>

      {/* 고스트 */}
      {dragState && draggedItem && (
        <div style={{
          position: 'fixed',
          left:   dragState.listLeft,
          top:    dragState.ghostY,
          width:  dragState.listWidth,
          height: ITEM_H,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--surface)',
          border: '1.5px solid var(--accent)',
          boxShadow: 'var(--shadow-floating)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 14px',
          pointerEvents: 'none',
          zIndex: 100,
          boxSizing: 'border-box',
        }}>
          <draggedItem.Icon size={14} color="var(--accent)" />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
            {draggedItem.label}
          </span>
          <div style={{ color: 'var(--accent)', padding: '4px 2px', display: 'flex', alignItems: 'center' }}>
            <FiMenu size={14} />
          </div>
        </div>
      )}

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
        ☰ 핸들을 드래그해 순서를 바꿔보세요
      </p>
    </div>
  )
}
