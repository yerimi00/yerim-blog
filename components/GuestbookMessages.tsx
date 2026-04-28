'use client'

import { useState } from 'react'
import { FiLock } from 'react-icons/fi'
import GuestbookForm from './GuestbookForm'
import type { GuestbookEntry } from '@/lib/guestbook'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function MessageCard({ entry }: { entry: GuestbookEntry }) {
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

      {entry.isPublic === false ? (
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

      <div style={{ textAlign: 'right' }}>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'JetBrains Mono, monospace',
          fontStyle: 'italic',
        }}>
          From. {entry.name}
        </span>
      </div>
    </div>
  )
}

interface Props {
  initialEntries: GuestbookEntry[]
}

export default function GuestbookMessages({ initialEntries }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries)

  function handleSuccess(entry: GuestbookEntry) {
    setEntries((prev) => [entry, ...prev])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <GuestbookForm onSuccess={handleSuccess} />

      {entries.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
          아직 방명록이 없어요. 첫 번째로 남겨주세요! ✨
        </p>
      ) : (
        <div style={{
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
