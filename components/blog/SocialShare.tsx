'use client'

import { useState } from 'react'
import { FiLinkedin, FiLink, FiCheck } from 'react-icons/fi'

export default function SocialShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const openLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=450,noopener,noreferrer',
    )
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    background: 'transparent',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    transition: 'border-color 0.15s, color 0.15s',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.15rem' }}>공유</span>
      <button style={base} onClick={openLinkedin} title="LinkedIn에 공유">
        <FiLinkedin size={13} />
      </button>
      <button
        style={{
          ...base,
          color: copied ? '#22c55e' : 'var(--text-muted)',
          borderColor: copied ? 'rgba(34,197,94,0.4)' : 'var(--border)',
        }}
        onClick={copyLink}
        title={copied ? '복사됨!' : '링크 복사'}
      >
        {copied ? <FiCheck size={13} /> : <FiLink size={13} />}
      </button>
    </div>
  )
}
