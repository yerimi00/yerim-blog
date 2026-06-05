'use client'

import { useState } from 'react'
import { FiLock, FiMessageSquare } from 'react-icons/fi'
import GuestbookForm from './GuestbookForm'
import type { GuestbookEntry, GuestbookComment } from '@/lib/guestbook'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function CommentSection({ entryId, initialCount, isPublic, pinVerified, adminPin, onPinVerify }: {
  entryId: string
  initialCount: number
  isPublic?: boolean
  pinVerified: boolean
  adminPin: string
  onPinVerify: (pin: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<GuestbookComment[]>([])
  const [loaded, setLoaded] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinChecking, setPinChecking] = useState(false)

  const needsPin = isPublic === false

  async function loadComments() {
    if (loaded) { setOpen(o => !o); return }
    const res = await fetch(`/api/guestbook/${entryId}/comments`)
    const data = await res.json()
    setComments(Array.isArray(data) ? data : [])
    setLoaded(true)
    setOpen(true)
  }

  async function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault()
    if (!pin.trim()) return
    setPinChecking(true)
    setPinError('')
    const res = await fetch(`/api/guestbook/${entryId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pin }),
    })
    if (res.ok) {
      onPinVerify(pin)
    } else {
      setPinError('비밀번호가 올바르지 않아요.')
    }
    setPinChecking(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    await fetch(`/api/guestbook/${entryId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), message: message.trim(), ...(needsPin && { password: adminPin }) }),
    })
    setComments(prev => [...prev, {
      id: crypto.randomUUID(),
      name: name.trim() || '익명',
      message: message.trim(),
      createdAt: new Date().toISOString(),
    }])
    setMessage('')
    setSubmitting(false)
  }

  return (
    <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.25rem', paddingTop: '0.75rem' }}>
      <button
        onClick={loadComments}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.75rem', color: 'var(--text-muted)', padding: 0,
          fontFamily: 'inherit',
        }}
      >
        <FiMessageSquare size={12} />
        {loaded
          ? (comments.length > 0 ? `댓글 ${comments.length}개` : '댓글 달기')
          : (initialCount > 0 ? `댓글 ${initialCount}개` : '댓글 달기')}
      </button>

      {open && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {loaded && comments.length === 0 && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>아직 댓글이 없어요.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} style={{
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              display: 'flex', flexDirection: 'column', gap: '0.25rem',
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)' }}>{c.name}</span>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.6, wordBreak: 'break-word' }}>{c.message}</p>
            </div>
          ))}

          {needsPin && !pinVerified ? (
            <form onSubmit={handleVerifyPin} style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={pin}
                onChange={e => { setPin(e.target.value); setPinError('') }}
                style={{
                  flex: 1, border: `1px solid ${pinError ? '#ef4444' : 'var(--border)'}`, borderRadius: '6px',
                  padding: '0.4rem 0.6rem', fontSize: '0.8rem',
                  background: 'transparent', color: 'var(--text)',
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
              <button
                type="submit"
                disabled={pinChecking || !pin.trim()}
                style={{
                  padding: '0.4rem 0.75rem', borderRadius: '6px',
                  border: '1px solid var(--accent)', background: 'transparent',
                  color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 600,
                  cursor: pin.trim() ? 'pointer' : 'default',
                  fontFamily: 'inherit', whiteSpace: 'nowrap',
                }}
              >
                {pinChecking ? '...' : '확인'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
              <input
                type="text"
                placeholder="닉네임"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={30}
                style={{
                  border: '1px solid var(--border)', borderRadius: '6px',
                  padding: '0.4rem 0.6rem', fontSize: '0.8rem',
                  background: 'transparent', color: 'var(--text)',
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="댓글을 입력하세요"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  maxLength={300}
                  required
                  style={{
                    flex: 1, border: '1px solid var(--border)', borderRadius: '6px',
                    padding: '0.4rem 0.6rem', fontSize: '0.8rem',
                    background: 'transparent', color: 'var(--text)',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  style={{
                    padding: '0.4rem 0.75rem', borderRadius: '6px',
                    border: '1px solid var(--accent)', background: 'transparent',
                    color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 600,
                    cursor: message.trim() ? 'pointer' : 'default',
                    fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}
                >
                  {submitting ? '...' : '등록'}
                </button>
              </div>
            </form>
          )}
          {pinError && <p style={{ margin: 0, fontSize: '0.75rem', color: '#ef4444' }}>{pinError}</p>}
        </div>
      )}
    </div>
  )
}

function MessageCard({ entry }: { entry: GuestbookEntry }) {
  const [pinVerified, setPinVerified] = useState(false)
  const [adminPin, setAdminPin] = useState('')
  const [showPwChange, setShowPwChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [pwChangeStatus, setPwChangeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [pwChangeError, setPwChangeError] = useState('')

  function handlePinVerify(pin: string) {
    setPinVerified(true)
    setAdminPin(pin)
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (!newPassword.trim()) return
    setPwChangeStatus('loading')
    setPwChangeError('')
    const res = await fetch(`/api/guestbook/${entry.id}/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: adminPin, newPassword: newPassword.trim() }),
    })
    if (res.ok) {
      setAdminPin(newPassword.trim())
      setNewPassword('')
      setPwChangeStatus('success')
      setTimeout(() => { setPwChangeStatus('idle'); setShowPwChange(false) }, 1500)
    } else {
      const data = await res.json()
      setPwChangeError(data.error ?? '변경에 실패했습니다.')
      setPwChangeStatus('error')
    }
  }

  return (
    <div
      style={{
        border: '1.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem 1.25rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      <div style={{
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.02em',
      }}>
        {formatDate(entry.createdAt)}
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      {entry.isPublic === false && !pinVerified ? (
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <FiLock size={13} style={{ flexShrink: 0 }} />
          비공개 메시지입니다.
        </p>
      ) : (
        <p style={{
          margin: 0,
          fontSize: '0.92rem',
          color: 'var(--text)',
          lineHeight: 1.8,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}>
          {entry.message}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
        {entry.isPublic === false && pinVerified && (
          <button
            onClick={() => { setShowPwChange(o => !o); setPwChangeStatus('idle'); setPwChangeError('') }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'inherit',
              textDecoration: 'underline', textUnderlineOffset: '2px',
            }}
          >
            비밀번호 변경
          </button>
        )}
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'JetBrains Mono, monospace',
          fontStyle: 'italic',
        }}>
          From. {entry.name}
        </span>
      </div>

      {entry.isPublic === false && pinVerified && showPwChange && (
        <form onSubmit={handlePasswordChange} style={{ display: 'flex', gap: '0.4rem' }}>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={e => { setNewPassword(e.target.value); setPwChangeStatus('idle'); setPwChangeError('') }}
            maxLength={30}
            style={{
              flex: 1, border: `1px solid ${pwChangeStatus === 'error' ? '#ef4444' : pwChangeStatus === 'success' ? '#22c55e' : 'var(--border)'}`,
              borderRadius: '6px', padding: '0.4rem 0.6rem', fontSize: '0.8rem',
              background: 'transparent', color: 'var(--text)', outline: 'none', fontFamily: 'inherit',
            }}
          />
          <button
            type="submit"
            disabled={pwChangeStatus === 'loading' || !newPassword.trim()}
            style={{
              padding: '0.4rem 0.75rem', borderRadius: '6px',
              border: '1px solid var(--accent)', background: 'transparent',
              color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 600,
              cursor: newPassword.trim() ? 'pointer' : 'default',
              fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
          >
            {pwChangeStatus === 'loading' ? '...' : pwChangeStatus === 'success' ? '완료 ✓' : '변경'}
          </button>
        </form>
      )}
      {pwChangeError && <p style={{ margin: 0, fontSize: '0.75rem', color: '#ef4444' }}>{pwChangeError}</p>}

      <CommentSection
        entryId={entry.id}
        initialCount={entry.commentCount}
        isPublic={entry.isPublic}
        pinVerified={pinVerified}
        adminPin={adminPin}
        onPinVerify={handlePinVerify}
      />
    </div>
  )
}

interface Props {
  initialEntries: GuestbookEntry[]
}

export default function GuestbookMessages({ initialEntries }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries)

  function handleSuccess(entry: { id: string; name: string; message: string; createdAt: string }) {
    setEntries((prev) => [{ ...entry, commentCount: 0 }, ...prev])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <GuestbookForm onSuccess={handleSuccess} />

      {entries.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
          아직 방명록이 없어요. 첫 번째로 남겨주세요! ✨
        </p>
      ) : (
        <div className="guestbook-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}>
          {entries.map((entry) =>
            <MessageCard key={entry.id} entry={entry} />
          )}
        </div>
      )}
    </div>
  )
}
