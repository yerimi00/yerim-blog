'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'yerim-blog:autosave-demo'

interface DraftData {
  title: string
  greeting: string
  date: string
  updatedAt: number
}

function loadDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'conflict'

export default function AutoSaveDemo() {
  const [title, setTitle] = useState('오늘의 할 일 메모')
  const [greeting, setGreeting] = useState('')
  const [date, setDate] = useState('2025-10-11')
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [localLoaded, setLocalLoaded] = useState(false)

  // Layer 2: 500ms debounce
  const scheduleSave = useCallback((data: DraftData) => {
    setStatus('saving')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setLastSaved(new Date())
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    }, 500)
  }, [])

  useEffect(() => {
    // Check for local draft newer than server
    const snap = loadDraft()
    if (snap) {
      setTitle(snap.title)
      setGreeting(snap.greeting)
      setDate(snap.date)
      setStatus('conflict')
      setLastSaved(new Date(snap.updatedAt))
      setLocalLoaded(true)
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [])

  useEffect(() => {
    if (!localLoaded && status === 'idle') return
    scheduleSave({ title, greeting, date, updatedAt: Date.now() })
  }, [title, greeting, date])

  // Page hide flush
  useEffect(() => {
    const flush = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, greeting, date, updatedAt: Date.now() }))
    }
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [title, greeting, date])

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY)
    setStatus('idle')
    setLastSaved(null)
    setTitle('오늘의 할 일 메모')
    setGreeting('')
    setDate('2025-10-11')
    setLocalLoaded(false)
  }

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{
        background: 'var(--surface, #fff)',
        border: '1px solid var(--border, #e5e7eb)',
        borderRadius: 'var(--radius-xl)', padding: 20,
      }}>
        {/* Status bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 16, fontSize: 12,
          color: status === 'saved' ? '#10b981' : status === 'conflict' ? '#f59e0b' : 'var(--text-muted, #9ca3af)',
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: status === 'saved' ? '#10b981' : status === 'saving' ? '#f59e0b' : status === 'conflict' ? '#f59e0b' : 'var(--border)',
          }} />
          {status === 'saving' && '저장 중...'}
          {status === 'saved' && `저장됨 ${lastSaved?.toLocaleTimeString()}`}
          {status === 'conflict' && `로컬 드래프트 복원됨 (${lastSaved?.toLocaleTimeString()})`}
          {status === 'idle' && (lastSaved ? `마지막 저장: ${lastSaved.toLocaleTimeString()}` : '입력하면 자동저장됩니다')}
        </div>

        <label style={labelStyle}>문서 제목</label>
        <input
          value={title}
          onChange={e => { setTitle(e.target.value); setLocalLoaded(true) }}
          style={{ ...inputStyle, marginBottom: 12 }}
        />

        <label style={labelStyle}>내용</label>
        <textarea
          value={greeting}
          onChange={e => { setGreeting(e.target.value); setLocalLoaded(true) }}
          placeholder="메모를 입력하세요..."
          rows={3}
          style={{ ...inputStyle, resize: 'none', marginBottom: 12 }}
        />

        <label style={labelStyle}>날짜</label>
        <input
          type="date"
          value={date}
          onChange={e => { setDate(e.target.value); setLocalLoaded(true) }}
          style={{ ...inputStyle, marginBottom: 16 }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={clearDraft}
            style={{
              flex: 1, padding: '10px', border: '1px solid var(--border, #e5e7eb)',
              background: 'var(--surface, #fff)',
              borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              fontSize: 13, color: 'var(--text-muted, #6b7280)',
            }}
          >
            초기화
          </button>
          <div style={{
            flex: 2, padding: '10px',
            background: 'var(--surface-container)', borderRadius: 'var(--radius-lg)',
            fontSize: 12, color: 'var(--accent)', textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            500ms 디바운스 + pagehide flush
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: 'var(--text-muted, #6b7280)', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-lg)',
  border: '1.5px solid var(--border, #e5e7eb)',
  background: 'var(--surface, #fff)',
  fontSize: 13, color: 'var(--text, #111)',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'Pretendard, sans-serif',
}
