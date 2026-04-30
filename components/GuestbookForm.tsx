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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* 모달 위 텍스트 */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em' }}>
            방명록 작성 완료
          </p>
          <p style={{ margin: '0.2rem 0 0', fontSize: '1.3rem', fontWeight: 600, color: '#fff' }}>
            방명록 남겨주셔서 감사합니당 ㅎㅎ
          </p>
        </div>

        {/* 이미지 카드 */}
        <div style={{ position: 'relative', borderRadius: '28px', overflow: 'hidden', width: '340px', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={randomImage}
            alt="방명록 전송 완료"
            style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
          />

          {/* 하단 그라데이션 + 확인 버튼 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
            padding: '2rem 1.75rem 1.75rem',
          }}>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '14px',
                border: '1.5px solid rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = 'rgba(255,255,255,0.28)'
                btn.style.borderColor = 'rgba(255,255,255,0.8)'
              }}
              onMouseLeave={e => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = 'rgba(255,255,255,0.15)'
                btn.style.borderColor = 'rgba(255,255,255,0.5)'
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GuestbookForm({ onSuccess }: Props) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showModal, setShowModal] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    if (!isPublic && !password.trim()) {
      setErrorMsg('비공개 메시지에는 비밀번호를 설정해주세요.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim(), isPublic, ...(!isPublic && { password: password.trim() }) }),
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
            title={!isPublic ? '비공개 — 저에게만 전달됩니다' : '공개 — 모두에게 보입니다'}
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

        {/* 비공개 시 비밀번호 입력 */}
        {!isPublic && (
          <>
            <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0' }}>
              <span style={{
                fontSize: '0.75rem',
                color: '#3b82f6',
                fontFamily: 'JetBrains Mono, monospace',
                flexShrink: 0,
                letterSpacing: '0.04em',
              }}>
                비밀번호
              </span>
              <input
                type="password"
                placeholder="열람 비밀번호 설정"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            </div>
          </>
        )}

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
            placeholder="메시지를 남겨주세요 :)"
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
