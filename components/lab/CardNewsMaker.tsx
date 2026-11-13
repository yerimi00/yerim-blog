'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { parseCards, splitHighlight, type Card } from '@/lib/card-news'
import { SITE_DOMAIN_NAME } from '@/lib/site'

const W = 1080
const H = 1350
const X = 90
const TEXT_W = 800
const FONT = 'Pretendard, system-ui, sans-serif'

// 내보내는 이미지는 사이트 테마와 무관하게 "사진 + 아래쪽 어두운 그라데이션 + 흰 글자" 구성이라 색을 고정한다.
// 포인트 색만 블로그 강조색(--accent)을 따른다
const PAPER = '#f4f4f4'
const INK = '#ffffff'
const INK_SOFT = 'rgba(255,255,255,0.85)'
const BOX_LINE = '#1f1f1f'

const PLACEHOLDER = `# 표지 **제목**
---
# 두 번째 카드 제목
> 강조하고 싶은 문장
![](https://이미지-주소.png)
본문을 적어요.
---
뉴스 기사는 그대로 붙여넣어도 돼요. --- 가 없으면 문단(빈 줄) 단위로 카드가 나뉘어요.`

type Kind = 'cover' | 'body' | 'outro'

// 단어 단위로 줄바꿈하고, 한 단어가 너무 길면 글자 단위로 자른다. 각 줄은 원문의 부분 문자열이다
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

function clampLines(lines: string[], max: number): string[] {
  if (lines.length <= max) return lines
  const shown = lines.slice(0, max)
  shown[max - 1] = `${shown[max - 1].slice(0, -1)}…`
  return shown
}

// `**단어**`를 강조색으로 칠하며 여러 줄을 그린다. 줄은 원문에서 위치를 찾아 강조 범위를 맞춘다
function drawHighlighted(ctx: CanvasRenderingContext2D, lines: string[], segments: { text: string; hi: boolean }[], y: number, lineGap: number, accent: string) {
  const flags = segments.flatMap((s) => Array.from(s.text, () => s.hi))
  const plain = segments.map((s) => s.text).join('')
  let cursor = 0
  lines.forEach((line, i) => {
    const body = line.endsWith('…') ? line.slice(0, -1) : line
    const start = Math.max(0, plain.indexOf(body, cursor))
    cursor = start + body.length
    let x = X
    for (let j = 0; j < line.length; j++) {
      ctx.fillStyle = flags[start + j] ? accent : INK
      ctx.fillText(line[j], x, y + i * lineGap)
      x += ctx.measureText(line[j]).width
    }
  })
}

function drawBackground(ctx: CanvasRenderingContext2D, image: HTMLImageElement | null) {
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, H)
  if (image) {
    // object-fit: cover
    const scale = Math.max(W / image.naturalWidth, H / image.naturalHeight)
    const w = image.naturalWidth * scale
    const h = image.naturalHeight * scale
    ctx.drawImage(image, (W - w) / 2, (H - h) / 2, w, h)
  }
  const shade = ctx.createLinearGradient(0, H - 942, 0, H)
  shade.addColorStop(0, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.82)')
  ctx.fillStyle = shade
  ctx.fillRect(0, H - 942, W, 942)
}

function drawFooter(ctx: CanvasRenderingContext2D, withArrow: boolean) {
  ctx.fillStyle = INK
  ctx.font = `700 28px ${FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(SITE_DOMAIN_NAME, W / 2, 1290)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  if (!withArrow) return
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(892, 1290)
  ctx.lineTo(1010, 1290)
  ctx.moveTo(996, 1280)
  ctx.lineTo(1010, 1290)
  ctx.lineTo(996, 1300)
  ctx.stroke()
}

// 템플릿 03: 흰 박스 강조 문장을 왼쪽·오른쪽 번갈아 띄운다
function drawQuotes(ctx: CanvasRenderingContext2D, quotes: string[]) {
  ctx.font = `500 26px ${FONT}`
  quotes.slice(0, 3).forEach((q, i) => {
    const text = clampLines(wrap(ctx, q, 820), 1)[0]
    const w = ctx.measureText(text).width + 20
    const x = i % 2 === 0 ? 113 : 1010 - w
    const y = 377 + i * 272
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x, y, w, 53)
    ctx.strokeStyle = BOX_LINE
    ctx.lineWidth = 1.5
    ctx.strokeRect(x, y, w, 53)
    ctx.fillStyle = BOX_LINE
    ctx.fillText(text, x + 10, y + 12)
  })
}

function drawCard(canvas: HTMLCanvasElement, card: Card, kind: Kind, image: HTMLImageElement | null) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()

  drawBackground(ctx, image)
  ctx.textBaseline = 'top'
  drawQuotes(ctx, card.quotes)

  // 글 덩어리는 아래(BOTTOM)에 붙이고 위로 쌓는다
  const BOTTOM = kind === 'cover' ? 1160 : 1190
  const isCover = kind !== 'body'
  const titleSize = isCover ? 104 : 60
  const titleGap = titleSize * 1.26
  const bodySize = card.title ? 30 : 40
  const bodyGap = bodySize * 1.4

  const segments = splitHighlight(card.title)
  ctx.font = `700 ${titleSize}px ${FONT}`
  const titleLines = card.title ? clampLines(wrap(ctx, segments.map((s) => s.text).join(''), TEXT_W), isCover ? 4 : 3) : []

  ctx.font = `${card.title ? 400 : 600} ${bodySize}px ${FONT}`
  const bodyLines = card.body ? clampLines(wrap(ctx, card.body, TEXT_W), card.title ? 7 : 9) : []

  const between = titleLines.length && bodyLines.length ? 24 : 0
  let y = BOTTOM - bodyLines.length * bodyGap - between - titleLines.length * titleGap

  ctx.font = `700 ${titleSize}px ${FONT}`
  drawHighlighted(ctx, titleLines, segments, y, titleGap, accent)
  y += titleLines.length * titleGap + between

  ctx.font = `${card.title ? 400 : 600} ${bodySize}px ${FONT}`
  ctx.fillStyle = card.title ? INK_SOFT : INK
  bodyLines.forEach((l, i) => ctx.fillText(l, X, y + i * bodyGap))

  drawFooter(ctx, kind !== 'outro')
}

function CardCanvas({ card, kind, filename, sharedImage, version }: { card: Card; kind: Kind; filename: string; sharedImage: HTMLImageElement | null; version: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  // ponytail: 카드별 업로드는 카드 순서(이 컴포넌트의 key=index)에 붙는다. 카드를 옮기면 이미지는 자리에 남음
  const [uploaded, setUploaded] = useState<HTMLImageElement | null>(null)
  const [textImage, setTextImage] = useState<HTMLImageElement | null>(null)
  const image = uploaded ?? textImage ?? sharedImage

  useEffect(() => {
    let alive = true
    setTextImage(null)
    if (card.image) loadImage(card.image).then((img) => alive && setTextImage(img))
    return () => { alive = false }
  }, [card.image])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // Pretendard가 늦게 로드되면 대체 글꼴로 그려지므로 먼저 기다린다
    Promise.all([document.fonts.load('700 60px Pretendard'), document.fonts.load('400 30px Pretendard')])
      .catch(() => undefined)
      .then(() => drawCard(canvas, card, kind, image))
  }, [card, kind, image, version])

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
        aria-label={`카드: ${card.title || card.body}`}
        style={{ width: '100%', height: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
      />
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button type="button" onClick={download} style={{ ...buttonStyle, flex: 1 }}>
          PNG 저장
        </button>
        <button
          type="button"
          onClick={() => (uploaded ? setUploaded(null) : fileRef.current?.click())}
          style={buttonStyle}
        >
          {uploaded ? '이미지 빼기' : '이미지'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pickImage(e, setUploaded)} />
      </div>
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

// crossOrigin으로 불러와야 캔버스가 오염되지 않아 PNG 저장이 된다. CORS를 막는 이미지는 실패 → null
function loadDirect(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// 원격 이미지는 먼저 Next 이미지 최적화(/_next/image, 같은 출처)로 받는다 — next.config.js remotePatterns(Notion S3 등)에 있는 호스트만 통과.
// 거기 없는 호스트는 직접 시도, 그것도 CORS로 막히면 배경 없이 그린다
async function loadImage(src: string): Promise<HTMLImageElement | null> {
  if (/^https?:\/\//.test(src)) {
    const viaNext = await loadDirect(`/_next/image?url=${encodeURIComponent(src)}&w=1080&q=85`)
    if (viaNext) return viaNext
  }
  return loadDirect(src)
}

function pickImage(e: React.ChangeEvent<HTMLInputElement>, set: (img: HTMLImageElement | null) => void) {
  const file = e.target.files?.[0]
  if (file) loadDirect(URL.createObjectURL(file)).then(set)
  e.target.value = ''
}

const OUTRO: Card = { title: `더 많은 이야기는\n**${SITE_DOMAIN_NAME}**에서`, body: '', quotes: [] }

export default function CardNewsMaker({ initialText }: { initialText: string }) {
  const [text, setText] = useState(initialText)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { resolvedTheme } = useTheme()
  const cards = parseCards(text)

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <button type="button" onClick={() => fileRef.current?.click()} style={buttonStyle}>
          전체 배경 이미지
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={(e) => pickImage(e, setImage)} hidden />
        {image && (
          <button type="button" onClick={() => setImage(null)} style={buttonStyle}>
            이미지 빼기
          </button>
        )}
        <span>`# 제목` · 제목 안 `**포인트**` · `&gt; 강조 박스` · `![](이미지 주소)` 카드 배경 · `---` 카드 나누기</span>
      </div>

      {cards.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {[...cards, OUTRO].map((card, i) => (
            <CardCanvas
              key={i}
              card={card}
              kind={i === 0 ? 'cover' : i === cards.length ? 'outro' : 'body'}
              filename={`card-${String(i + 1).padStart(2, '0')}.png`}
              sharedImage={image}
              version={resolvedTheme ?? ''}
            />
          ))}
        </div>
      )}
    </div>
  )
}
