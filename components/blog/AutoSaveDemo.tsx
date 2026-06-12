'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { CSSProperties } from 'react'

const STORAGE_KEY = 'yerim-blog:autosave-demo-v2'
const DEBOUNCE_MS  = 10_000
const DEFAULT_TITLE = '오늘의 할 일 메모'
const DEFAULT_DATE  = '2025-10-11'

interface DraftData {
  title:     string
  content:   string
  date:      string
  updatedAt: number
}

function loadDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DraftData) : null
  } catch { return null }
}

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

type SaveStatus = 'idle' | 'typing' | 'saved'

const labelStyle: CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: 'var(--text-muted, #6b7280)', marginBottom: 6,
}
const inputStyle: CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-lg)',
  border: '1.5px solid var(--border, #e5e7eb)',
  background: 'var(--surface, #fff)',
  fontSize: 13, color: 'var(--text, #111)',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'Pretendard, sans-serif',
}

export default function AutoSaveDemo() {
  const [title,   setTitle]   = useState(DEFAULT_TITLE)
  const [content, setContent] = useState('')
  const [date,    setDate]    = useState(DEFAULT_DATE)
  const [status,    setStatus]    = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [animKey,   setAnimKey]   = useState(0)

  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const titleRef      = useRef(title)
  const contentRef    = useRef(content)
  const dateRef       = useRef(date)

  titleRef.current   = title
  contentRef.current = content
  dateRef.current    = date

  // 마운트: 저장된 드래프트 복원
  useEffect(() => {
    const snap = loadDraft()
    if (!snap) return
    setTitle(snap.title)
    setContent(snap.content)
    setDate(snap.date)
    setLastSaved(snap.updatedAt)
  }, [])

  const save = useCallback((data: { title: string; content: string; date: string }) => {
    const now = Date.now()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, updatedAt: now }))
    setLastSaved(now)
    setStatus('saved')
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    savedTimerRef.current = setTimeout(() => setStatus('idle'), 2000)
  }, [])

  const scheduleSave = useCallback((data: { title: string; content: string; date: string }) => {
    setStatus('typing')
    setAnimKey(k => k + 1)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => save(data), DEBOUNCE_MS)
  }, [save])

  // pagehide flush — pending 디바운스를 즉시 저장
  useEffect(() => {
    const flush = () => {
      if (!timerRef.current) return
      clearTimeout(timerRef.current)
      timerRef.current = null
      save({ title: titleRef.current, content: contentRef.current, date: dateRef.current })
    }
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [save])

  const clearAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    localStorage.removeItem(STORAGE_KEY)
    setTitle(DEFAULT_TITLE); setContent(''); setDate(DEFAULT_DATE)
    setStatus('idle'); setLastSaved(null); setAnimKey(0)
  }

  const statusColor = status === 'saved'  ? '#10b981' :
                      status === 'typing' ? 'var(--accent)' : 'var(--text-muted, #9ca3af)'
  const dotBg       = status === 'saved'  ? '#10b981' :
                      status === 'typing' ? 'var(--accent)' : 'var(--border)'
  const statusText  = status === 'typing' ? '입력 중...' :
                      status === 'saved'  ? `저장됨 ${lastSaved ? fmtTime(lastSaved) : ''}` :
                      lastSaved           ? `마지막 저장: ${fmtTime(lastSaved)}` : '입력하면 자동저장됩니다'

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>

        {/* 상태 바 */}
        <div style={{ padding: '12px 14px 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: statusColor }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotBg, transition: 'background 0.3s', flexShrink: 0 }} />
          {statusText}
        </div>

        {/* 디바운스 카운트다운 바 */}
        <div style={{ height: 3, margin: '8px 0 0', background: 'var(--border)', overflow: 'hidden' }}>
          {status === 'typing' && (
            <div
              key={animKey}
              style={{
                height: '100%', background: 'var(--accent)',
                transformOrigin: 'left',
                animation: `autosave-cd ${DEBOUNCE_MS}ms linear forwards`,
              }}
            />
          )}
        </div>
        <style>{`@keyframes autosave-cd { from { transform: scaleX(1) } to { transform: scaleX(0) } }`}</style>

        <div style={{ padding: '12px 14px 16px' }}>
          <label style={labelStyle}>문서 제목</label>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); scheduleSave({ title: e.target.value, content: contentRef.current, date: dateRef.current }) }}
            style={{ ...inputStyle, marginBottom: 12 }}
          />

          <label style={labelStyle}>내용</label>
          <textarea
            value={content}
            onChange={e => { setContent(e.target.value); scheduleSave({ title: titleRef.current, content: e.target.value, date: dateRef.current }) }}
            placeholder="메모를 입력하세요..."
            rows={3}
            style={{ ...inputStyle, resize: 'none', marginBottom: 12 }}
          />

          <label style={labelStyle}>날짜</label>
          <input
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); scheduleSave({ title: titleRef.current, content: contentRef.current, date: e.target.value }) }}
            style={{ ...inputStyle, marginBottom: 16 }}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={clearAll}
              style={{ flex: 1, padding: '10px', border: '1px solid var(--border, #e5e7eb)', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted, #6b7280)' }}
            >
              초기화
            </button>
            <div style={{ flex: 2, padding: '10px', background: 'var(--surface-container)', borderRadius: 'var(--radius-lg)', fontSize: 11, color: 'var(--accent)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              10s 디바운스 + pagehide flush
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
