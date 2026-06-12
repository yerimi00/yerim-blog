'use client'

import { useState, useEffect, useRef } from 'react'

export default function SearchBarBadgeDemo() {
  const [unread, setUnread] = useState(0)
  const [showPanel, setShowPanel] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: '예약이 확정되었습니다', read: false },
    { id: 2, text: '새 메시지가 있습니다', read: false },
    { id: 3, text: '문서 저장 완료', read: true },
  ])
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUnread(notifications.filter(n => !n.read).length)
  }, [notifications])

  const markRead = (id: number) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const addNotif = () => {
    setNotifications(prev => [
      { id: Date.now(), text: `새 알림 ${prev.length + 1}`, read: false },
      ...prev,
    ])
  }

  return (
    <div style={{ width: 320, margin: '0 auto', fontFamily: 'Pretendard, sans-serif' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px',
        background: '#fff', borderRadius: 14,
        border: '1px solid var(--border, #e5e7eb)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: 12,
      }}>
        {/* Search (fake button) */}
        <div style={{
          flex: 1, height: 40, borderRadius: 100,
          background: 'var(--surface, #f3f4f6)',
          display: 'flex', alignItems: 'center',
          padding: '0 14px', gap: 8, cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>업체 검색</span>
        </div>

        {/* Bell with badge */}
        <button
          onClick={() => setShowPanel(p => !p)}
          style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', padding: 6, display: 'flex',
          }}
        >
          {unread > 0 ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#7c3aed" stroke="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          )}
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              minWidth: 16, height: 16, borderRadius: 8,
              background: '#ef4444', color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 3px',
            }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </div>

      {/* Notification panel */}
      {showPanel && (
        <div ref={panelRef} style={{
          background: '#fff',
          border: '1px solid var(--border, #e5e7eb)',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--border, #e5e7eb)' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>알림</span>
            <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>모두 읽기</button>
          </div>
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px', cursor: 'pointer',
                background: n.read ? 'transparent' : '#f5f3ff',
                borderBottom: '1px solid var(--border, #f3f4f6)',
              }}
            >
              {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />}
              {n.read && <div style={{ width: 7, height: 7, flexShrink: 0 }} />}
              <span style={{ fontSize: 13, color: 'var(--text, #111)' }}>{n.text}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={addNotif}
        style={{
          width: '100%', padding: '10px', border: 'none', borderRadius: 10,
          background: '#7c3aed', color: '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}
      >
        알림 추가
      </button>
    </div>
  )
}
