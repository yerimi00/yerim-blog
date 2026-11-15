'use client'

import { useRef, useState } from 'react'
import { detectTags, giphyQuery, rankMemes } from '@/lib/meme-match'
import type { Meme } from '@/lib/memes'

const PAGE = 12

type Result = { mine: Meme[]; giphy: Meme[]; giphyEnabled: boolean; tags: string[] }

export default function MemeFinder({ memes, tags }: { memes: Meme[]; tags: string[] }) {
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [round, setRound] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const requestId = useRef(0)

  // 같은 입력으로 다시 부르면(round+1) 내 짤은 다시 섞고 GIPHY는 다음 묶음
  const recommend = async (nextPicked: string[], nextRound: number) => {
    const id = ++requestId.current
    const used = Array.from(new Set([...nextPicked, ...detectTags(text)]))
    const mine = rankMemes(memes, used, text).slice(0, PAGE)
    const need = PAGE - mine.length
    setRound(nextRound)
    setResult({ mine, giphy: [], giphyEnabled: true, tags: used })
    if (need === 0) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ q: giphyQuery(used, text), offset: String(nextRound * need), limit: String(need) })
      const res = await fetch(`/api/memes/giphy?${params}`)
      const data = (await res.json()) as { enabled: boolean; items: Meme[] }
      if (id === requestId.current) setResult({ mine, giphy: data.items, giphyEnabled: data.enabled, tags: used })
    } catch {
      if (id === requestId.current) setResult({ mine, giphy: [], giphyEnabled: false, tags: used })
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }

  const toggleTag = (tag: string) => {
    const next = picked.includes(tag) ? picked.filter((t) => t !== tag) : [...picked, tag]
    setPicked(next)
    recommend(next, 0)
  }

  const items = result ? [...result.mine, ...result.giphy] : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          recommend(picked, 0)
        }}
        style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="지금 상황을 적어 보세요 (예: 월요일 아침부터 야근 확정)"
          aria-label="상황 문장"
          maxLength={100}
          style={{ flex: '1 1 260px', minWidth: 0, padding: '0.6rem 0.85rem', fontSize: '0.95rem', color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
        />
        <button type="submit" style={{ ...buttonStyle, fontWeight: 700, color: 'var(--on-primary)', background: 'var(--accent)', borderColor: 'var(--accent)' }}>
          짤 추천받기
        </button>
      </form>

      <div role="group" aria-label="감정 태그" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {tags.map((tag) => {
          const on = picked.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => toggleTag(tag)}
              style={{
                ...buttonStyle,
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: on ? 700 : 400,
                color: on ? 'var(--accent)' : 'var(--text)',
                borderColor: on ? 'var(--accent)' : 'var(--border)',
                background: on ? 'var(--accent-soft)' : 'var(--surface)',
              }}
            >
              {tag}
            </button>
          )
        })}
      </div>

      {result && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>{result.tags.length ? `찾은 감정: ${result.tags.join(' · ')}` : '감정을 못 찾아서 문장 그대로 찾았어요'}</span>
          <button type="button" onClick={() => recommend(picked, round + 1)} disabled={loading} style={buttonStyle}>
            다시 추천
          </button>
        </div>
      )}

      {!result && <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>상황을 적거나 감정을 고르면 어울리는 짤을 골라 줘요.</p>}

      {result && items.length === 0 && !loading && (
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>어울리는 짤을 아직 못 찾았어요. 다른 감정을 골라 보세요.</p>
      )}

      {items.length > 0 && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem' }}>
          {items.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </ul>
      )}

      {loading && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>GIF 찾는 중…</p>}

      {result && result.giphy.length > 0 && (
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>GIF: Powered by GIPHY</p>
      )}
    </div>
  )
}

function MemeCard({ meme }: { meme: Meme }) {
  const [status, setStatus] = useState('')
  const flash = (msg: string) => {
    setStatus(msg)
    setTimeout(() => setStatus(''), 1600)
  }

  const copy = async () => {
    try {
      // 클립보드는 PNG만 받는다 → GIF는 첫 장면이 정지 이미지로 복사된다. Promise를 넘겨야 Safari에서 클릭 직후 권한이 유지된다
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': fetchBlob(meme.src).then(toPng) })])
      flash('복사됨')
    } catch {
      flash('복사 실패 — 저장을 써 주세요')
    }
  }

  const download = async () => {
    try {
      const blob = await fetchBlob(meme.src)
      const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'gif'
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${meme.title.trim().slice(0, 30) || 'meme'}.${ext}`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } catch {
      flash('저장 실패')
    }
  }

  return (
    <li style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface)' }}>
      <div style={{ position: 'relative', aspectRatio: '1 / 1', background: 'var(--surface-container)' }}>
        {/* GIF 움직임을 살리려고 next/image 대신 img */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={meme.src} alt={meme.title || '짤'} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        <span style={{ position: 'absolute', top: '0.4rem', left: '0.4rem', padding: '0.1rem 0.45rem', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)' }}>
          {meme.source === 'mine' ? '내 짤' : 'GIPHY'}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.5rem' }}>
        <span title={meme.title} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '1.2em' }}>
          {status || meme.title}
        </span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button type="button" onClick={copy} style={{ ...buttonStyle, flex: 1, padding: '0.35rem' }}>복사</button>
          <button type="button" onClick={download} style={{ ...buttonStyle, flex: 1, padding: '0.35rem' }}>저장</button>
        </div>
      </div>
    </li>
  )
}

// 먼저 원본 주소로 받고, CORS로 막히면 Next 이미지 프록시(같은 출처)로 다시 받는다 — Notion 업로드 파일(S3)은 remotePatterns에 있다
async function fetchBlob(src: string): Promise<Blob> {
  try {
    const res = await fetch(src)
    if (res.ok) return await res.blob()
  } catch {
    // CORS 실패 → 아래 프록시
  }
  const res = await fetch(`/_next/image?url=${encodeURIComponent(src)}&w=1080&q=90`)
  if (!res.ok) throw new Error(`image ${res.status}`)
  return res.blob()
}

async function toPng(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0)
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png'))), 'image/png'))
}

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 0.9rem',
  fontSize: '0.85rem',
  color: 'var(--text)',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
}
