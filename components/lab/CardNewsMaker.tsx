'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { parseCards, type Card } from '@/lib/card-news'
import { SITE_DOMAIN_NAME } from '@/lib/site'

const W = 1080
const H = 1350
const PAD = 96
const FONT = 'Pretendard, system-ui, sans-serif'

const PLACEHOLDER = `# 표지 제목
부제나 한 줄 설명
---
# 두 번째 카드 제목
본문을 적어요.
---
뉴스 기사는 그대로 붙여넣어도 돼요. --- 가 없으면 문단(빈 줄) 단위로 카드가 나뉘어요.`

type Kind = 'cover' | 'body' | 'outro'

// 단어 단위로 줄바꿈하고, 한 단어가 너무 길면 글자 단위로 자른다
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  for (const para of text.split('\n')) {
    let line = ''
    for (const word of para.split(' ')) {
      const next = line ? `${line} ${word}` : word
      if (ctx.measureText(next).width <= maxWidth) { line = next; continue }
      if (line) lines.push(line)
      line = ''
      for (const ch of word) {
        if (ctx.measureText(line + ch).width > maxWidth) { lines.push(line); line = '' }
        line += ch
      }
    }
    lines.push(line)
  }
  return lines
}

// y부터 최대 maxLines줄을 그리고, 넘치면 마지막 줄을 말줄임한다. 다음 y를 돌려준다
function drawLines(ctx: CanvasRenderingContext2D, text: string, y: number, size: number, lineHeight: number, maxLines: number): number {
  const lines = wrap(ctx, text, W - PAD * 2)
  const shown = lines.slice(0, maxLines)
  if (lines.length > maxLines) shown[maxLines - 1] = `${shown[maxLines - 1].slice(0, -1)}…`
  shown.forEach((l, i) => ctx.fillText(l, PAD, y + i * size * lineHeight))
  return y + shown.length * size * lineHeight
}

function drawCard(canvas: HTMLCanvasElement, card: Card, kind: Kind, page: string) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const css = getComputedStyle(document.documentElement)
  const color = (name: string) => css.getPropertyValue(name).trim()

  ctx.fillStyle = color('--bg')
  ctx.fillRect(0, 0, W, H)
  ctx.textBaseline = 'top'

  // 머리: 사이트 이름 + 쪽수
  ctx.font = `600 32px ${FONT}`
  ctx.fillStyle = color('--accent')
  ctx.fillText(SITE_DOMAIN_NAME, PAD, PAD)
  ctx.fillStyle = color('--text-muted')
  ctx.textAlign = 'right'
  ctx.fillText(page, W - PAD, PAD)
  ctx.textAlign = 'left'

  if (kind === 'outro') {
    ctx.fillStyle = color('--text')
    ctx.font = `700 72px ${FONT}`
    ctx.fillText('더 많은 이야기는', PAD, H / 2 - 100)
    ctx.fillStyle = color('--accent')
    ctx.fillText(SITE_DOMAIN_NAME, PAD, H / 2)
    return
  }

  const isCover = kind === 'cover'
  let y = isCover ? 380 : 260
  ctx.fillStyle = color('--accent')
  ctx.fillRect(PAD, y - 48, 96, 10)

  if (card.title) {
    const size = isCover ? 88 : 64
    ctx.font = `700 ${size}px ${FONT}`
    ctx.fillStyle = color('--text')
    y = drawLines(ctx, card.title, y, size, 1.3, isCover ? 5 : 3) + 48
  }
  if (card.body) {
    // 제목 없는 카드(뉴스 문단)는 본문을 조금 크게
    const size = isCover && !card.title ? 72 : card.title ? 42 : 56
    ctx.font = `${isCover && !card.title ? 700 : 400} ${size}px ${FONT}`
    ctx.fillStyle = color(card.title ? '--text-secondary' : '--text')
    const lineHeight = 1.6
    const maxLines = Math.max(1, Math.floor((H - PAD - 60 - y) / (size * lineHeight)))
    drawLines(ctx, card.body, y, size, lineHeight, maxLines)
  }
}

function CardCanvas({ card, kind, page, filename, version }: { card: Card; kind: Kind; page: string; filename: string; version: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // Pretendard가 늦게 로드되면 대체 글꼴로 그려지므로 먼저 기다린다
    Promise.all([document.fonts.load(`700 64px Pretendard`), document.fonts.load(`400 42px Pretendard`)])
      .catch(() => undefined)
      .then(() => drawCard(canvas, card, kind, page))
  }, [card, kind, page, version])

  const download = () => {
    ref.current?.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      // 클릭 직후 바로 해제하면 Safari에서 저장이 끊길 수 있다
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    }, 'image/png')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <canvas
        ref={ref}
        width={W}
        height={H}
        aria-label={`카드 ${page}: ${card.title || card.body}`}
        style={{ width: '100%', height: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
      />
      <button type="button" onClick={download} style={buttonStyle}>
        PNG 저장
      </button>
    </div>
  )
}

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  fontSize: '0.85rem',
  color: 'var(--text)',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
}

export default function CardNewsMaker({ initialText }: { initialText: string }) {
  const [text, setText] = useState(initialText)
  const { resolvedTheme } = useTheme()
  const cards = parseCards(text)
  const total = cards.length + 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        aria-label="카드뉴스 내용"
        rows={14}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          fontFamily: 'inherit',
          color: 'var(--text)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          resize: 'vertical',
        }}
      />

      {cards.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {cards.map((card, i) => (
            <CardCanvas
              key={i}
              card={card}
              kind={i === 0 ? 'cover' : 'body'}
              page={`${i + 1} / ${total}`}
              filename={`card-${String(i + 1).padStart(2, '0')}.png`}
              version={resolvedTheme ?? ''}
            />
          ))}
          <CardCanvas
            card={{ title: '', body: '' }}
            kind="outro"
            page={`${total} / ${total}`}
            filename={`card-${String(total).padStart(2, '0')}.png`}
            version={resolvedTheme ?? ''}
          />
        </div>
      )}
    </div>
  )
}
