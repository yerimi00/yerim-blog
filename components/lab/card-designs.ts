// 카드뉴스 캔버스 디자인. 외부 템플릿을 베끼지 않고 흔한 레이아웃 패턴(사진 오버레이·프레임·터미널·트윗)만 참고했다.
// 내보내는 이미지는 사이트 테마와 무관하므로 디자인별 색을 여기서 고정하고, 포인트 색만 블로그 강조색(--accent)을 받는다
import { splitHighlight, type Card } from '@/lib/card-news'
import { AUTHOR_NAME, SITE_DOMAIN_NAME } from '@/lib/site'

export const W = 1080
export const H = 1350
const X = 90
const SANS = 'Pretendard, system-ui, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, monospace'

export const DESIGNS = {
  photo: '포토 오버레이',
  frame: '프레임 카드',
  terminal: '다크 터미널',
  tweet: '트윗형',
} as const
export type DesignId = keyof typeof DESIGNS
export type Kind = 'cover' | 'body' | 'outro'

export type DrawInput = {
  card: Card
  kind: Kind
  index: number
  total: number
  image: HTMLImageElement | null
  avatar: HTMLImageElement | null
  accent: string
}

type Ctx = CanvasRenderingContext2D

// ---------- 글자 도구 ----------

// 단어 단위로 줄바꿈하고, 한 단어가 너무 길면 글자 단위로 자른다. 각 줄은 원문의 부분 문자열이다
function wrap(ctx: Ctx, text: string, maxWidth: number): string[] {
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
  if (max <= 0) return []
  if (lines.length <= max) return lines
  const shown = lines.slice(0, max)
  shown[max - 1] = `${shown[max - 1].slice(0, -1)}…`
  return shown
}

// 남은 높이에 들어가는 줄 수
const fit = (space: number, gap: number, cap: number) => Math.max(0, Math.min(cap, Math.floor(space / gap)))

// 제목: `**단어**`는 hi 색으로 칠한다. 그린 높이를 돌려준다
function drawTitle(ctx: Ctx, title: string, x: number, y: number, maxW: number, size: number, maxLines: number, base: string, hi: string): number {
  if (!title) return 0
  const segments = splitHighlight(title)
  const flags = segments.flatMap((s) => Array.from(s.text, () => s.hi))
  const plain = segments.map((s) => s.text).join('')
  ctx.font = `700 ${size}px ${SANS}`
  const lines = clampLines(wrap(ctx, plain, maxW), maxLines)
  const gap = size * 1.25
  let cursor = 0
  lines.forEach((line, i) => {
    const body = line.endsWith('…') ? line.slice(0, -1) : line
    const start = Math.max(0, plain.indexOf(body, cursor))
    cursor = start + body.length
    let cx = x
    for (let j = 0; j < line.length; j++) {
      ctx.fillStyle = flags[start + j] ? hi : base
      ctx.fillText(line[j], cx, y + i * gap)
      cx += ctx.measureText(line[j]).width
    }
  })
  return lines.length * gap
}

function drawText(ctx: Ctx, text: string, x: number, y: number, maxW: number, font: string, color: string, gap: number, maxLines: number): number {
  if (!text) return 0
  ctx.font = font
  ctx.fillStyle = color
  const lines = clampLines(wrap(ctx, text, maxW), maxLines)
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * gap))
  return lines.length * gap
}

function countLines(ctx: Ctx, text: string, font: string, maxW: number): number {
  ctx.font = font
  return text ? wrap(ctx, text, maxW).length : 0
}

// ---------- 도형·이미지 도구 ----------

function box(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fill()
}

// cover: 꽉 채우고 넘치는 부분 자르기 / contain: 전부 보이게 넣고 남는 곳은 bg
function drawImage(ctx: Ctx, img: HTMLImageElement, x: number, y: number, w: number, h: number, r: number, mode: 'cover' | 'contain', bg?: string) {
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.clip()
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(x, y, w, h) }
  const scale = (mode === 'cover' ? Math.max : Math.min)(w / img.naturalWidth, h / img.naturalHeight)
  const iw = img.naturalWidth * scale
  const ih = img.naturalHeight * scale
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih)
  ctx.restore()
}

function arrow(ctx: Ctx, y: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(892, y)
  ctx.lineTo(1010, y)
  ctx.moveTo(996, y - 10)
  ctx.lineTo(1010, y)
  ctx.lineTo(996, y + 10)
  ctx.stroke()
}

const pad = (n: number) => String(n).padStart(2, '0')
const pageLabel = (d: DrawInput) => `${pad(d.index + 1)} / ${pad(d.total)}`

// ---------- 포토 오버레이: 사진 + 아래쪽 어두운 그라데이션 + 하단 흰 글자 ----------

function photo(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, accent } = d
  ctx.fillStyle = '#f4f4f4'
  ctx.fillRect(0, 0, W, H)
  if (image) drawImage(ctx, image, 0, 0, W, H, 0, 'cover')
  const shade = ctx.createLinearGradient(0, H - 942, 0, H)
  shade.addColorStop(0, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.82)')
  ctx.fillStyle = shade
  ctx.fillRect(0, H - 942, W, 942)

  // 흰 박스 강조 문장을 왼쪽·오른쪽 번갈아 띄운다
  ctx.font = `500 26px ${SANS}`
  card.quotes.slice(0, 3).forEach((q, i) => {
    const text = clampLines(wrap(ctx, q, 820), 1)[0]
    const w = ctx.measureText(text).width + 20
    const x = i % 2 === 0 ? 113 : 1010 - w
    const y = 377 + i * 272
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x, y, w, 53)
    ctx.strokeStyle = '#1f1f1f'
    ctx.lineWidth = 1.5
    ctx.strokeRect(x, y, w, 53)
    ctx.fillStyle = '#1f1f1f'
    ctx.fillText(text, x + 10, y + 12)
  })

  // 글 덩어리는 아래(bottom)에 붙이고 위로 쌓는다
  const big = kind !== 'body'
  const titleSize = big ? 104 : 60
  const titleFont = `700 ${titleSize}px ${SANS}`
  const bodySize = card.title ? 30 : 40
  const bodyFont = `${card.title ? 400 : 600} ${bodySize}px ${SANS}`
  const titleLines = Math.min(countLines(ctx, splitHighlight(card.title).map((s) => s.text).join(''), titleFont, 800), big ? 4 : 3)
  const bodyLines = Math.min(countLines(ctx, card.body, bodyFont, 800), card.title ? 7 : 9)
  const between = titleLines && bodyLines ? 24 : 0
  const bottom = kind === 'cover' ? 1160 : 1190
  let y = bottom - bodyLines * bodySize * 1.4 - between - titleLines * titleSize * 1.25
  y += drawTitle(ctx, card.title, X, y, 800, titleSize, big ? 4 : 3, '#ffffff', accent) + between
  drawText(ctx, card.body, X, y, 800, bodyFont, card.title ? 'rgba(255,255,255,0.85)' : '#ffffff', bodySize * 1.4, bodyLines)

  ctx.fillStyle = '#ffffff'
  ctx.font = `700 28px ${SANS}`
  ctx.textAlign = 'center'
  ctx.fillText(SITE_DOMAIN_NAME, W / 2, 1272)
  ctx.textAlign = 'left'
  if (kind !== 'outro') arrow(ctx, 1290, '#ffffff')
}

// ---------- 프레임 카드: 강조색 바탕 + 흰 패널 ----------

function frame(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, accent } = d
  const INK = '#191c1e'
  const PX = 130
  const innerW = 820
  const panelBottom = 1200
  ctx.fillStyle = accent
  ctx.fillRect(0, 0, W, H)
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.18)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 12
  box(ctx, 70, 160, 940, panelBottom - 160, 36, '#ffffff')
  ctx.restore()

  ctx.font = `700 28px ${SANS}`
  ctx.fillStyle = '#ffffff'
  ctx.fillText(SITE_DOMAIN_NAME, X, 88)
  ctx.textAlign = 'right'
  ctx.fillText(pageLabel(d), W - X, 88)
  ctx.textAlign = 'left'
  if (kind !== 'outro') arrow(ctx, 1275, '#ffffff')

  if (kind === 'outro') {
    drawTitle(ctx, card.title, PX, 560, innerW, 80, 3, INK, accent)
    return
  }

  let y = 230
  if (image) {
    const h = kind === 'cover' ? 460 : 420
    drawImage(ctx, image, PX, y, innerW, h, 20, 'contain', '#f1f2f4')
    y += h + 50
  }
  const big = kind === 'cover'
  y += drawTitle(ctx, card.title, PX, y, innerW, big ? 80 : 58, big ? 4 : 3, INK, accent) + 24

  // 강조 문장: 옅은 강조색 알약
  ctx.font = `600 28px ${SANS}`
  for (const q of card.quotes.slice(0, 2)) {
    const text = clampLines(wrap(ctx, q, innerW - 48), 1)[0]
    ctx.save()
    ctx.globalAlpha = 0.12
    box(ctx, PX, y, ctx.measureText(text).width + 48, 56, 28, accent)
    ctx.restore()
    ctx.fillStyle = accent
    ctx.fillText(text, PX + 24, y + 13)
    y += 72
  }
  drawText(ctx, card.body, PX, y + 6, innerW, `400 34px ${SANS}`, '#4b5563', 54, fit(panelBottom - 50 - y, 54, 12))
}

// ---------- 다크 터미널: 창 + 프롬프트 + 코드 블록 ----------

function terminal(ctx: Ctx, d: DrawInput) {
  const { card, kind, index, total, image } = d
  const TEXT = '#e6edf3'
  const MUTED = '#7d8590'
  const GREEN = '#3fb950'
  const YELLOW = '#e3b341'
  const TX = 110
  const innerW = 860
  const winBottom = 1220
  ctx.fillStyle = '#0b0e14'
  ctx.fillRect(0, 0, W, H)
  box(ctx, 60, 100, 960, winBottom - 100, 24, '#151a23')
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(60, 100, 960, 64, [24, 24, 0, 0])
  ctx.fillStyle = '#1d2430'
  ctx.fill()
  ctx.restore()
  ;['#ff5f56', '#ffbd2e', '#27c93f'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(104 + i * 32, 132, 9, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.font = `400 24px ${MONO}`
  ctx.fillStyle = MUTED
  ctx.textAlign = 'center'
  ctx.fillText(`${SITE_DOMAIN_NAME} — zsh`, W / 2, 120)
  ctx.textAlign = 'left'

  const command = kind === 'cover' ? 'cat README.md' : kind === 'outro' ? `open https://${SITE_DOMAIN_NAME}` : `cat ${pad(index)}.md`
  ctx.font = `500 30px ${MONO}`
  ctx.fillStyle = GREEN
  ctx.fillText('$', TX, 210)
  ctx.fillStyle = MUTED
  ctx.fillText(command, TX + 40, 210)
  let y = 290

  const big = kind !== 'body'
  y += drawTitle(ctx, card.title, TX, y, innerW, big ? 76 : 56, big ? 4 : 3, TEXT, GREEN) + 24

  if (kind === 'outro') {
    ctx.font = `500 30px ${MONO}`
    ctx.fillStyle = GREEN
    ctx.fillText('$', TX, y + 20)
    ctx.fillRect(TX + 40, y + 18, 18, 36)
  }

  ctx.font = `400 28px ${MONO}`
  for (const q of card.quotes.slice(0, 3)) {
    ctx.fillStyle = YELLOW
    ctx.fillText(clampLines(wrap(ctx, `> ${q}`, innerW), 1)[0], TX, y)
    y += 46
  }
  if (card.quotes.length) y += 12

  const codeLines = card.code ? card.code.replace(/\t/g, '  ').split('\n') : []
  const reserve = codeLines.length ? Math.min(codeLines.length, 12) * 36 + 60 : 0
  y += drawText(ctx, card.body, TX, y, innerW, `400 32px ${SANS}`, '#c9d1d9', 51, fit(winBottom - 60 - y - reserve, 51, 10))

  if (codeLines.length) {
    const shown = fit(winBottom - 80 - y, 36, 12)
    if (shown > 0) {
      y += 20
      const lines = codeLines.slice(0, shown)
      box(ctx, TX, y, innerW, lines.length * 36 + 40, 12, '#0b0e14')
      ctx.font = `400 24px ${MONO}`
      ctx.fillStyle = '#a5d6ff'
      lines.forEach((l, i) => ctx.fillText(clampLines(wrap(ctx, l, innerW - 48), 1)[0] ?? '', TX + 24, y + 20 + i * 36))
      y += lines.length * 36 + 40
    }
  }

  if (image && winBottom - 50 - y > 220) drawImage(ctx, image, TX, y + 24, innerW, Math.min(winBottom - 50 - y - 24, 520), 12, 'contain', '#0b0e14')

  ctx.font = `400 26px ${MONO}`
  ctx.fillStyle = MUTED
  ctx.fillText(`[${index + 1}/${total}]`, 60, 1262)
  if (kind !== 'outro') {
    ctx.textAlign = 'right'
    ctx.fillText('next →', 1020, 1262)
    ctx.textAlign = 'left'
  }
}

// ---------- 트윗형: 프로필 + 글 + 첨부 이미지 ----------

function tweet(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, avatar, accent } = d
  const INK = '#0f1419'
  const MUTED = '#536471'
  const LINE = '#e1e8ed'
  const textW = W - X * 2
  const bottom = 1170
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // 프로필 사진(로고), 못 불러오면 강조색 원
  if (avatar) drawImage(ctx, avatar, X, 145, 110, 110, 55, 'cover', '#f1f2f4')
  else box(ctx, X, 145, 110, 110, 55, accent)
  ctx.font = `700 38px ${SANS}`
  ctx.fillStyle = INK
  ctx.fillText(AUTHOR_NAME, 228, 158)
  ctx.font = `400 32px ${SANS}`
  ctx.fillStyle = MUTED
  ctx.fillText(`@${SITE_DOMAIN_NAME}`, 228, 210)

  let y = 310
  const big = kind !== 'body'
  y += drawTitle(ctx, card.title, X, y, textW, big ? 68 : 54, big ? 6 : 4, INK, accent)
  if (card.title) y += 28
  y += drawText(ctx, card.body, X, y, textW, `400 42px ${SANS}`, INK, 63, fit(bottom - y, 63, image ? 5 : 10))

  // 강조 문장: 인용 트윗처럼 테두리 상자
  if (card.quotes.length && bottom - y > 160) {
    const quotes = card.quotes.slice(0, 3)
    const h = 80 + quotes.length * 48
    y += 30
    ctx.strokeStyle = '#cfd9de'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(X, y, textW, h, 24)
    ctx.stroke()
    ctx.font = `600 26px ${SANS}`
    ctx.fillStyle = MUTED
    ctx.fillText(SITE_DOMAIN_NAME, X + 32, y + 28)
    ctx.font = `400 32px ${SANS}`
    ctx.fillStyle = INK
    quotes.forEach((q, i) => ctx.fillText(clampLines(wrap(ctx, q, textW - 64), 1)[0], X + 32, y + 70 + i * 48))
    y += h
  }

  if (image && bottom - y > 220) drawImage(ctx, image, X, y + 30, textW, Math.min(bottom - y - 30, 560), 28, 'cover')

  ctx.fillStyle = LINE
  ctx.fillRect(X, 1200, textW, 2)
  ctx.font = `400 28px ${SANS}`
  ctx.fillStyle = MUTED
  ctx.fillText(`${pageLabel(d)} · ${SITE_DOMAIN_NAME}`, X, 1232)
  if (kind !== 'outro') arrow(ctx, 1250, MUTED)
}

const RENDERERS: Record<DesignId, (ctx: Ctx, d: DrawInput) => void> = { photo, frame, terminal, tweet }

export function drawCard(canvas: HTMLCanvasElement, design: DesignId, d: DrawInput) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
  RENDERERS[design](ctx, d)
}
