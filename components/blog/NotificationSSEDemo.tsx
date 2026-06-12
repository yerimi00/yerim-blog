'use client'

import { useState, useEffect, useRef } from 'react'

interface Notification {
  id: number
  type: 'reserve' | 'review' | 'system'
  message: string
  time: string
  read: boolean
}

const MOCK_MESSAGES = [
  { type: 'reserve' as const, message: '예약이 확정되었습니다' },
  { type: 'review' as const, message: '새 후기가 등록되었습니다' },
  { type: 'system' as const, message: '초안이 저장되었습니다' },
  { type: 'reserve' as const, message: '일정이 변경되었습니다' },
  { type: 'review' as const, message: '새 메시지를 받았습니다' },
]

const TYPE_COLOR: Record<string, string> = {
  reserve: '#10b981',
  review: '#f59e0b',
  system: '#6366f1',
}
const TYPE_LABEL: Record<string, string> = {
  reserve: '예약',
  review: '후기',
  system: '시스템',
}

let msgIdx = 0
let idCounter = 0

export default function NotificationSSEDemo() {
  const [connected, setConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reconnectRef = useRef(0)

  const connect = () => {
    setConnected(false)
    reconnectRef.current = 0
    // Simulate connection handshake
    setTimeout(() => {
      setConnected(true)
      timerRef.current = setInterval(() => {
        const m = MOCK_MESSAGES[msgIdx % MOCK_MESSAGES.length]
        msgIdx++
        const now = new Date()
        setNotifications(prev => [
          {
            id: idCounter++,
            ...m,
            time: `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`,
            read: false,
          },
          ...prev,
        ].slice(0, 10))
      }, 2500)
    }, 800)
  }

  const disconnect = () => {
    setConnected(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const unread = notifications.filter(n => !n.read).length

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: connected ? '#10b981' : 'var(--border)',
            boxShadow: connected ? '0 0 0 3px rgba(16,185,129,0.2)' : 'none',
            transition: 'all 0.3s',
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text, #111)' }}>
            {connected ? 'SSE 연결됨' : '연결 안 됨'}
          </span>
          {unread > 0 && (
            <span style={{
              background: '#ef4444', color: '#fff',
              fontSize: 11, fontWeight: 700,
              padding: '2px 7px', borderRadius: 100,
            }}>
              {unread}
            </span>
          )}
        </div>
        <button
          onClick={connected ? disconnect : connect}
          style={{
            padding: '6px 14px', borderRadius: 'var(--radius-lg)', border: 'none',
            background: connected ? '#fee2e2' : 'var(--accent)',
            color: connected ? '#ef4444' : '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          {connected ? '연결 끊기' : '연결'}
        </button>
      </div>

      {/* Note */}
      <div style={{
        fontSize: 11, color: 'var(--text-muted, #9ca3af)',
        marginBottom: 12,
        padding: '8px 10px',
        background: 'var(--surface, #f9fafb)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border, #e5e7eb)',
      }}>
        실제 구현: fetch + ReadableStream으로 Bearer 토큰 SSE 구독, 최대 5회 자동 재연결
      </div>

      {/* Notifications */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
        {notifications.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted, #9ca3af)', fontSize: 13, padding: '32px 0' }}>
            {connected ? '알림 대기 중...' : '연결 버튼을 눌러 시작하세요'}
          </div>
        )}
        {notifications.map(n => (
          <div
            key={n.id}
            style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '10px 12px', borderRadius: 'var(--radius-xl)',
              background: n.read ? 'var(--surface)' : 'var(--surface-container)',
              border: `1px solid ${n.read ? 'var(--border)' : 'var(--accent)'}`,
              transition: 'all 0.2s',
            }}
            onClick={() => setNotifications(prev =>
              prev.map(x => x.id === n.id ? { ...x, read: true } : x)
            )}
          >
            <span style={{
              fontSize: 10, fontWeight: 700,
              background: TYPE_COLOR[n.type],
              color: '#fff', padding: '2px 6px', borderRadius: 'var(--radius)',
              flexShrink: 0, marginTop: 1,
            }}>
              {TYPE_LABEL[n.type]}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--text, #111)', lineHeight: 1.4 }}>
                {n.message}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted, #9ca3af)', marginTop: 2 }}>
                {n.time}
              </div>
            </div>
            {!n.read && (
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 5 }} />
            )}
          </div>
        ))}
      </div>

      {notifications.length > 0 && unread > 0 && (
        <button
          onClick={markAllRead}
          style={{
            width: '100%', marginTop: 10, padding: '9px',
            border: '1px solid var(--border, #e5e7eb)',
            background: 'var(--surface, #fff)',
            borderRadius: 'var(--radius-lg)', cursor: 'pointer',
            fontSize: 12, color: 'var(--text-muted, #6b7280)', fontWeight: 600,
          }}
        >
          모두 읽음 처리
        </button>
      )}
    </div>
  )
}
