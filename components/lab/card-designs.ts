// 카드뉴스 캔버스 디자인. 외부 템플릿을 베끼지 않고 흔한 레이아웃 패턴(사진 오버레이·프레임·터미널·트윗·메모앱·스프링 노트·네온 포스터·메신저·레트로 포스터)만 참고했다.
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
  memo: '메모앱형',
  notebook: '스프링 노트',
  neon: '블랙 + 네온',
  chat: '메신저 대화형',
  retro: '레트로 포스터',
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

function arrow(ctx: Ctx, y: number, color: string, width = 3) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
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

// ---------- 메모앱형: 휴대폰 메모 화면 + 체크리스트 ----------

function memo(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, accent } = d
  const INK = '#1c1c1e'
  const MUTED = '#9a9488'
  const TINT = '#d9a400'
  const MX = 80
  const textW = W - MX * 2
  const bottom = 1220
  ctx.fillStyle = '#fbf8f1'
  ctx.fillRect(0, 0, W, H)

  ctx.font = `600 34px ${SANS}`
  ctx.fillStyle = TINT
  ctx.fillText('‹ 메모', 56, 76)
  ctx.textAlign = 'right'
  ctx.fillText('완료', W - 56, 76)
  ctx.font = `400 26px ${SANS}`
  ctx.fillStyle = MUTED
  ctx.textAlign = 'center'
  ctx.fillText(`${SITE_DOMAIN_NAME} · ${pageLabel(d)}`, W / 2, 170)
  ctx.textAlign = 'left'

  let y = 240
  const big = kind !== 'body'
  y += drawTitle(ctx, card.title, MX, y, textW, big ? 84 : 62, big ? 5 : 3, INK, accent)
  if (card.title) y += 36

  if (kind === 'cover') {
    y += drawText(ctx, card.body, MX, y, textW, `400 38px ${SANS}`, MUTED, 58, 4)
  } else if (kind === 'body') {
    // 본문 줄마다 체크박스 한 칸
    ctx.font = `400 38px ${SANS}`
    for (const raw of card.body.split('\n').filter(Boolean)) {
      const item = raw.replace(/^•\s*/, '')
      const lines = clampLines(wrap(ctx, item, textW - 64), fit(bottom - y, 58, 4))
      if (!lines.length) break
      ctx.strokeStyle = '#c7c2b8'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(MX, y + 4, 36, 36, 9)
      ctx.stroke()
      ctx.fillStyle = INK
      lines.forEach((l, i) => ctx.fillText(l, MX + 64, y + i * 58))
      y += lines.length * 58 + 22
    }
  }

  // 강조 문장: 형광펜
  ctx.font = `600 36px ${SANS}`
  for (const q of card.quotes.slice(0, 3)) {
    if (y + 60 > bottom) break
    const text = clampLines(wrap(ctx, q, textW - 20), 1)[0]
    box(ctx, MX - 6, y + 14, ctx.measureText(text).width + 12, 30, 4, '#ffe58a')
    ctx.fillStyle = INK
    ctx.fillText(text, MX, y)
    y += 64
  }

  if (image && bottom - y > 220) drawImage(ctx, image, MX, y + 20, textW, Math.min(bottom - y - 20, 560), 20, 'contain', '#f1ede4')
  if (kind !== 'outro') arrow(ctx, 1280, MUTED)
}

// ---------- 스프링 노트: 색 바탕 + 스프링 달린 줄노트 ----------

function notebook(ctx: Ctx, d: DrawInput) {
  const { card, kind, index, image, accent } = d
  const INK = '#1f2937'
  const PX = 150
  const textW = 780
  const top = 170
  const bottom = 1200
  const LINE_GAP = 64
  ctx.fillStyle = '#8fb3e6'
  ctx.fillRect(0, 0, W, H)
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.15)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 10
  box(ctx, 90, top, 900, bottom - top, 18, '#ffffff')
  ctx.restore()

  // 줄 + 왼쪽 여백선
  ctx.fillStyle = '#e3e9f3'
  for (let ly = 330; ly < bottom - 30; ly += LINE_GAP) ctx.fillRect(110, ly + 50, 860, 2)
  ctx.fillStyle = '#f6c1c1'
  ctx.fillRect(130, top + 60, 2, bottom - top - 80)

  // 스프링
  for (let i = 0; i < 13; i++) {
    const rx = 140 + i * 64
    ctx.fillStyle = '#d6dde8'
    ctx.beginPath()
    ctx.arc(rx, top + 34, 9, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#3a3f4a'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.roundRect(rx - 8, top - 34, 16, 70, 8)
    ctx.stroke()
  }

  // 탭 라벨
  const label = kind === 'cover' ? 'NOTE' : kind === 'outro' ? 'END' : `NOTE ${pad(index)}`
  ctx.font = `700 26px ${SANS}`
  box(ctx, PX, top + 80, ctx.measureText(label).width + 40, 48, 24, accent)
  ctx.fillStyle = '#ffffff'
  ctx.fillText(label, PX + 20, top + 91)

  let y = 330
  const big = kind !== 'body'
  y += drawTitle(ctx, card.title, PX, y, textW, big ? 76 : 56, big ? 4 : 2, INK, accent) + 16
  y = Math.ceil((y - 330) / LINE_GAP) * LINE_GAP + 330 + 12
  y += drawText(ctx, card.body, PX, y, textW, `400 36px ${SANS}`, '#374151', LINE_GAP, fit(bottom - 60 - y, LINE_GAP, image ? 4 : 11))

  // 강조 문장: 강조색 밑줄
  ctx.font = `600 36px ${SANS}`
  for (const q of card.quotes.slice(0, 2)) {
    if (y + LINE_GAP > bottom - 60) break
    const text = clampLines(wrap(ctx, q, textW), 1)[0]
    ctx.fillStyle = INK
    ctx.fillText(text, PX, y)
    ctx.fillStyle = accent
    ctx.fillRect(PX, y + 44, ctx.measureText(text).width, 6)
    y += LINE_GAP
  }

  if (image && bottom - 60 - y > 200) drawImage(ctx, image, PX, y + 10, textW, Math.min(bottom - 70 - y, 500), 12, 'contain', '#f3f6fb')

  ctx.font = `700 28px ${SANS}`
  ctx.fillStyle = '#ffffff'
  ctx.fillText(SITE_DOMAIN_NAME, X, 1262)
  if (kind !== 'outro') arrow(ctx, 1278, '#ffffff')
}

// ---------- 블랙 + 네온: 검은 바탕, 라임 포인트, 라벨 줄, 큰 번호 ----------

function neon(ctx: Ctx, d: DrawInput) {
  const { card, kind, index, image } = d
  const LIME = '#c6ff3d'
  const MUTED = '#8a8a8a'
  const NX = 80
  const textW = W - NX * 2
  const bottom = 1180
  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, W, H)

  ctx.font = `500 22px ${MONO}`
  ctx.fillStyle = MUTED
  ctx.fillText('CARD NEWS', NX, 70)
  ctx.textAlign = 'center'
  ctx.fillText(SITE_DOMAIN_NAME.toUpperCase(), W / 2, 70)
  ctx.textAlign = 'right'
  ctx.fillText(pageLabel(d), W - NX, 70)
  ctx.textAlign = 'left'
  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(NX, 116, textW, 2)
  ctx.fillRect(NX, 1220, textW, 2)

  let y: number
  if (kind === 'body') {
    ctx.font = `700 240px ${SANS}`
    ctx.fillStyle = LIME
    ctx.fillText(pad(index), NX - 10, 140)
    y = 450 + drawTitle(ctx, card.title, NX, 450, textW, 64, 3, '#ffffff', LIME) + 28
  } else {
    y = kind === 'outro' ? 480 : 300
    y += drawTitle(ctx, card.title, NX, y, textW, kind === 'outro' ? 100 : 108, 5, '#ffffff', LIME) + 30
    if (kind === 'cover') {
      ctx.fillStyle = LIME
      ctx.fillRect(NX, y, 140, 12)
      y += 50
    }
  }
  y += drawText(ctx, card.body, NX, y, textW, `400 34px ${SANS}`, '#bdbdbd', 54, fit(bottom - y, 54, image ? 4 : 10))

  // 강조 문장: 라임 테두리 상자
  ctx.font = `600 30px ${SANS}`
  for (const q of card.quotes.slice(0, 2)) {
    if (y + 90 > bottom) break
    y += 24
    const text = clampLines(wrap(ctx, q, textW - 48), 1)[0]
    ctx.strokeStyle = LIME
    ctx.lineWidth = 2
    ctx.strokeRect(NX, y, ctx.measureText(text).width + 48, 60)
    ctx.fillStyle = LIME
    ctx.fillText(text, NX + 24, y + 15)
    y += 60
  }

  if (image && bottom - y > 220) drawImage(ctx, image, NX, y + 30, textW, Math.min(bottom - y - 30, 520), 0, 'contain', '#151515')

  ctx.font = `500 22px ${MONO}`
  ctx.fillStyle = MUTED
  ctx.fillText(`© ${SITE_DOMAIN_NAME}`, NX, 1262)
  if (kind !== 'outro') arrow(ctx, 1274, LIME)
}

// ---------- 메신저 대화형: 제목은 질문 말풍선, 본문은 답 말풍선 ----------

function bubbleLines(ctx: Ctx, text: string, font: string, maxW: number, maxLines: number) {
  ctx.font = font
  const lines = clampLines(wrap(ctx, text, maxW), maxLines)
  return { lines, width: Math.max(0, ...lines.map((l) => ctx.measureText(l).width)) }
}

function chat(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, avatar, accent } = d
  const INK = '#111827'
  const MUTED = '#6b7280'
  const PAD = 32
  const maxBubble = 700
  const bottom = 1200
  ctx.fillStyle = '#e9edf2'
  ctx.fillRect(0, 0, W, H)

  // 상단 대화방 바
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, 150)
  ctx.font = `400 48px ${SANS}`
  ctx.fillStyle = INK
  ctx.fillText('‹', 40, 46)
  ctx.font = `700 34px ${SANS}`
  ctx.textAlign = 'center'
  ctx.fillText(SITE_DOMAIN_NAME, W / 2, 40)
  ctx.font = `400 24px ${SANS}`
  ctx.fillStyle = MUTED
  ctx.fillText(`카드뉴스 ${pageLabel(d)}`, W / 2, 88)
  ctx.textAlign = 'left'

  let y = 210
  const left = 150
  // 질문(제목): 왼쪽 흰 말풍선 + 프로필
  if (card.title) {
    const size = kind === 'body' ? 46 : 60
    const plain = splitHighlight(card.title).map((s) => s.text).join('')
    const { lines, width } = bubbleLines(ctx, plain, `700 ${size}px ${SANS}`, maxBubble - PAD * 2, kind === 'body' ? 3 : 4)
    const h = lines.length * size * 1.25 + PAD * 2 - 8
    if (avatar) drawImage(ctx, avatar, 50, y, 76, 76, 38, 'cover', '#ffffff')
    else box(ctx, 50, y, 76, 76, 38, accent)
    box(ctx, left, y, width + PAD * 2, h, 32, '#ffffff')
    drawTitle(ctx, card.title, left + PAD, y + PAD, maxBubble - PAD * 2, size, lines.length, INK, accent)
    y += h + 28
  }

  // 답(본문): 오른쪽 강조색 말풍선
  if (card.body) {
    const { lines, width } = bubbleLines(ctx, card.body, `400 36px ${SANS}`, maxBubble - PAD * 2, fit(bottom - y - PAD * 2, 52, image ? 5 : 9))
    if (lines.length) {
      const w = width + PAD * 2
      const h = lines.length * 52 + PAD * 2 - 6
      box(ctx, W - 60 - w, y, w, h, 32, accent)
      ctx.fillStyle = '#ffffff'
      lines.forEach((l, i) => ctx.fillText(l, W - 60 - w + PAD, y + PAD + i * 52))
      y += h + 28
    }
  }

  // 강조 문장: 왼쪽 작은 말풍선
  for (const q of card.quotes.slice(0, 2)) {
    const { lines, width } = bubbleLines(ctx, q, `500 32px ${SANS}`, maxBubble - PAD * 2, 1)
    if (y + 100 > bottom || !lines.length) break
    box(ctx, left, y, width + PAD * 2, 92, 28, '#ffffff')
    ctx.fillStyle = INK
    ctx.fillText(lines[0], left + PAD, y + 28)
    y += 120
  }

  // 사진: 오른쪽 이미지 말풍선
  if (image && bottom - y > 220) {
    const h = Math.min(bottom - y, 460)
    drawImage(ctx, image, W - 60 - 620, y, 620, h, 32, 'contain', '#ffffff')
  }

  // 하단 입력창 + 보내기(=다음) 버튼
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 1230, W, 120)
  box(ctx, 40, 1252, kind === 'outro' ? 1000 : 880, 76, 38, '#f1f3f6')
  ctx.font = `400 30px ${SANS}`
  ctx.fillStyle = MUTED
  ctx.fillText('메시지 입력', 80, 1274)
  if (kind !== 'outro') {
    box(ctx, 944, 1252, 96, 76, 38, accent)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(970, 1290)
    ctx.lineTo(1014, 1290)
    ctx.moveTo(998, 1274)
    ctx.lineTo(1014, 1290)
    ctx.lineTo(998, 1306)
    ctx.stroke()
  }
}

// ---------- 레트로 포스터: 크림 바탕, 굵은 테두리, 밀린 그림자, 별 스티커 ----------

function star(ctx: Ctx, cx: number, cy: number, r: number, fill: string) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45
    const a = (Math.PI / 5) * i - Math.PI / 2
    ctx.lineTo(cx + rad * Math.cos(a), cy + rad * Math.sin(a))
  }
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = '#111111'
  ctx.lineWidth = 5
  ctx.stroke()
}

function retro(ctx: Ctx, d: DrawInput) {
  const { card, kind, index, image, accent } = d
  const INK = '#111111'
  const BOXES = ['#ffd23f', '#ffffff', '#a8d1ff', '#ffb3c7']
  const BX = 80
  const top = 180
  const bw = 920
  const bh = 990
  const IX = 130
  const innerW = 820
  const bottom = top + bh - 50
  ctx.fillStyle = '#f6efe1'
  ctx.fillRect(0, 0, W, H)

  // 밀린 그림자 + 굵은 테두리 상자
  box(ctx, BX + 18, top + 18, bw, bh, 28, INK)
  box(ctx, BX, top, bw, bh, 28, kind === 'cover' ? BOXES[0] : BOXES[index % BOXES.length])
  ctx.strokeStyle = INK
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.roundRect(BX, top, bw, bh, 28)
  ctx.stroke()

  // 위쪽 검은 알약 라벨 + 별 스티커
  const label = `CARD NEWS · ${pageLabel(d)}`
  ctx.font = `800 26px ${SANS}`
  box(ctx, BX, 86, ctx.measureText(label).width + 48, 58, 29, INK)
  ctx.fillStyle = '#f6efe1'
  ctx.fillText(label, BX + 24, 101)
  star(ctx, 950, 150, 70, accent)

  let y = top + 70
  const big = kind !== 'body'
  y += drawTitle(ctx, card.title, IX, y, innerW, big ? 96 : 68, big ? 5 : 3, INK, accent) + 30
  y += drawText(ctx, card.body, IX, y, innerW, `500 36px ${SANS}`, INK, 56, fit(bottom - y, 56, image ? 4 : 10))

  // 강조 문장: 살짝 기운 검은 스티커
  ctx.font = `700 30px ${SANS}`
  card.quotes.slice(0, 2).forEach((q, i) => {
    if (y + 100 > bottom) return
    y += 30
    const text = clampLines(wrap(ctx, q, innerW - 60), 1)[0]
    const w = ctx.measureText(text).width + 48
    ctx.save()
    ctx.translate(IX + w / 2, y + 32)
    ctx.rotate(((i % 2 === 0 ? -2 : 2) * Math.PI) / 180)
    box(ctx, -w / 2, -32, w, 64, 12, INK)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(text, -w / 2 + 24, -16)
    ctx.restore()
    y += 64
  })

  if (image && bottom - y > 220) {
    const h = Math.min(bottom - y - 30, 500)
    drawImage(ctx, image, IX, y + 30, innerW, h, 16, 'contain', '#ffffff')
    ctx.strokeStyle = INK
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(IX, y + 30, innerW, h, 16)
    ctx.stroke()
  }

  ctx.font = `800 28px ${SANS}`
  ctx.fillStyle = INK
  ctx.fillText(SITE_DOMAIN_NAME, BX, 1262)
  if (kind !== 'outro') arrow(ctx, 1278, INK, 5)
}

const RENDERERS: Record<DesignId, (ctx: Ctx, d: DrawInput) => void> = { photo, frame, terminal, tweet, memo, notebook, neon, chat, retro }

export function drawCard(canvas: HTMLCanvasElement, design: DesignId, d: DrawInput) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
  RENDERERS[design](ctx, d)
}
