'use client'

import { useState } from 'react'
import { FiSend, FiLock, FiUnlock } from 'react-icons/fi'

interface Props {
  onSuccess: (entry: { id: string; name: string; message: string; createdAt: string }) => void
}

const WRITE_IMAGES = [
  '/projects/write.jpg',
  '/projects/write1.jpg',
  '/projects/write2.jpg',
  '/projects/write3.jpg',
  '/projects/write4.jpg',
  '/projects/write5.jpg',
  '/projects/write6.jpg',
  '/projects/write7.jpg',
]

function SuccessModal({ onClose }: { onClose: () => void }) {
  const randomImage = WRITE_IMAGES[Math.floor(Math.random() * WRITE_IMAGES.length)]
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '2.25rem 2rem 1.75rem',
          width: '300px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af', letterSpacing: '0.02em' }}>
          방명록 전송 완료
        </p>
        <p style={{ margin: '0.25rem 0 1.5rem', fontSize: '1.2rem', fontWeight: 800, color: '#111' }}>
          방명록을 남겼어요!
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/projects/write.jpg"
          alt="방명록 전송 완료"
          style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.5rem' }}
        />

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '14px',
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
            transition: 'transform 0.1s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
        >
          확인
        </button>
      </div>
    </div>
  )
}

export default function GuestbookForm({ onSuccess }: Props) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showModal, setShowModal] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim(), isPublic }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? '오류가 발생했습니다.')
        setStatus('error')
        return
      }

      onSuccess({
        id: crypto.randomUUID(),
        name: name.trim() || '익명',
        message: message.trim(),
        createdAt: new Date().toISOString(),
      })
      setName('')
      setMessage('')
      setStatus('idle')
      setShowModal(true)
    } catch {
      setErrorMsg('네트워크 오류가 발생했습니다.')
      setStatus('error')
    }
  }

  return (
    <>
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}

      <form onSubmit={handleSubmit}>
        {/* 상단 구분선 */}
        <div style={{ borderTop: '1.5px solid var(--border)' }} />

        {/* 닉네임 + 비공개 토글 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 0',
        }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
            flexShrink: 0,
            letterSpacing: '0.04em',
          }}>
            닉네임
          </span>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.92rem',
              color: 'var(--text)',
              fontFamily: 'inherit',
              background: 'transparent',
            }}
          />
          <button
            type="button"
            onClick={() => setIsPublic(prev => !prev)}
            title={!isPublic ? '비공개 — 예림이에게만 전달됩니다' : '공개 — 모두에게 보입니다'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: !isPublic ? '#3b82f6' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
              flexShrink: 0,
            }}
          >
            {!isPublic ? <FiLock size={15} /> : <FiUnlock size={15} />}
          </button>
        </div>

        {/* 구분선 */}
        <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }} />

        {/* 메시지 입력 (› 프롬프트) */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          padding: '1rem 0',
          alignItems: 'flex-start',
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: '#3b82f6',
            fontSize: '1.1rem',
            lineHeight: 1.7,
            flexShrink: 0,
            userSelect: 'none',
          }}>
            ›
          </span>
          <textarea
            placeholder="예림이에게 메시지를 남겨주세요 :)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={5}
            required
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '0.95rem',
              color: 'var(--text)',
              lineHeight: 1.8,
              fontFamily: 'inherit',
              background: 'transparent',
            }}
          />
        </div>

        {/* 하단: 글자수 + 비공개 힌트 + 전송 */}
        <div style={{
          borderTop: '1.5px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {message.length} / 500
            </span>
            {!isPublic && (
              <span style={{
                fontSize: '0.75rem',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}>
                <FiLock size={11} />
                비공개
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !message.trim()}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              border: message.trim() ? '1.5px solid #3b82f6' : '1.5px solid var(--border)',
              background: 'transparent',
              color: message.trim() ? '#3b82f6' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: message.trim() ? 'pointer' : 'default',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (message.trim()) {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = '#3b82f6'
                btn.style.color = '#fff'
              }
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget as HTMLButtonElement
              btn.style.background = 'transparent'
              btn.style.color = message.trim() ? '#3b82f6' : 'var(--text-muted)'
            }}
          >
            {status === 'loading' ? '전송중' : <><FiSend size={13} />전송</>}
          </button>
        </div>

        {status === 'error' && (
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: '#ef4444' }}>{errorMsg}</p>
        )}
      </form>
    </>
  )
}
