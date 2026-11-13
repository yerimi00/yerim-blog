// 카드뉴스 캔버스 공용 도구: 크기·글꼴 상수, 줄바꿈, 제목(포인트 단어) 그리기, 도형·이미지 그리기.
// 디자인 렌더러(card-designs*.ts)는 모두 이 파일만 바라본다
import { splitHighlight, type Card } from '@/lib/card-news'

export const W = 1080
export const H = 1350
export const X = 90
export const SANS = 'Pretendard, system-ui, sans-serif'
export const MONO = '"JetBrains Mono", ui-monospace, monospace'
export const SERIF = 'Georgia, "Times New Roman", serif'

export type Kind = 'cover' | 'body' | 'outro'
export type Ctx = CanvasRenderingContext2D
export type DrawInput = {
  card: Card
  kind: Kind
  index: number
  total: number
  image: HTMLImageElement | null
  avatar: HTMLImageElement | null
  accent: string
}

export const pad = (n: number) => String(n).padStart(2, '0')
export const pageLabel = (d: DrawInput) => `${pad(d.index + 1)} / ${pad(d.total)}`

// ---------- 글자 ----------

// 단어 단위로 줄바꿈하고, 한 단어가 너무 길면 글자 단위로 자른다. 각 줄은 원문의 부분 문자열이다
export function wrap(ctx: Ctx, text: string, maxWidth: number): string[] {
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

export function clampLines(lines: string[], max: number): string[] {
  if (max <= 0) return []
  if (lines.length <= max) return lines
  const shown = lines.slice(0, max)
  shown[max - 1] = `${shown[max - 1].slice(0, -1)}…`
  return shown
}

// 남은 높이에 들어가는 줄 수
export const fit = (space: number, gap: number, cap: number) => Math.max(0, Math.min(cap, Math.floor(space / gap)))

// `**` 표시를 뗀 제목 글자
export const plainTitle = (title: string) => splitHighlight(title).map((s) => s.text).join('')

export function oneLine(ctx: Ctx, text: string, font: string, maxW: number): string {
  ctx.font = font
  return clampLines(wrap(ctx, text.replace(/\n/g, ' ').replace(/\*\*/g, ''), maxW), 1)[0] ?? ''
}

type TitleOpts = {
  align?: 'left' | 'center'
  /** 포인트 단어를 글자색 대신 형광펜(뒤 배경색)으로 칠한다 */
  marker?: string
  weight?: number
  lineHeight?: number
  font?: string
}

// 제목: `**단어**`는 hi 색(또는 형광펜)으로 칠한다. align=center면 x는 가운데 좌표. 그린 높이를 돌려준다
export function drawTitle(ctx: Ctx, title: string, x: number, y: number, maxW: number, size: number, maxLines: number, base: string, hi: string, opts: TitleOpts = {}): number {
  if (!title) return 0
  const segments = splitHighlight(title)
  const flags = segments.flatMap((s) => Array.from(s.text, () => s.hi))
  const plain = segments.map((s) => s.text).join('')
  ctx.font = `${opts.weight ?? 700} ${size}px ${opts.font ?? SANS}`
  const lines = clampLines(wrap(ctx, plain, maxW), maxLines)
  const gap = size * (opts.lineHeight ?? 1.25)
  let cursor = 0
  lines.forEach((line, i) => {
    const body = line.endsWith('…') ? line.slice(0, -1) : line
    const start = Math.max(0, plain.indexOf(body, cursor))
    cursor = start + body.length
    const widths = Array.from(line, (ch) => ctx.measureText(ch).width)
    const lineW = widths.reduce((a, b) => a + b, 0)
    const ly = y + i * gap
    const x0 = opts.align === 'center' ? x - lineW / 2 : x
    if (opts.marker) {
      let mx = x0
      widths.forEach((w, j) => {
        if (flags[start + j]) { ctx.fillStyle = opts.marker as string; ctx.fillRect(mx - 1, ly + size * 0.08, w + 2, size * 1.05) }
        mx += w
      })
    }
    let cx = x0
    widths.forEach((w, j) => {
      ctx.fillStyle = flags[start + j] && !opts.marker ? hi : base
      ctx.fillText(line[j], cx, ly)
      cx += w
    })
  })
  return lines.length * gap
}

export function titleLines(ctx: Ctx, title: string, size: number, maxW: number, maxLines: number, weight = 700): number {
  if (!title) return 0
  ctx.font = `${weight} ${size}px ${SANS}`
  return Math.min(wrap(ctx, plainTitle(title), maxW).length, maxLines)
}

export function drawText(ctx: Ctx, text: string, x: number, y: number, maxW: number, font: string, color: string, gap: number, maxLines: number, align: 'left' | 'center' = 'left'): number {
  if (!text) return 0
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = align
  // 본문의 `**` 표시는 그대로 보이지 않게 뗀다 (포인트 색은 제목에서만)
  const lines = clampLines(wrap(ctx, text.replace(/\*\*/g, ''), maxW), maxLines)
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * gap))
  ctx.textAlign = 'left'
  return lines.length * gap
}

export function countLines(ctx: Ctx, text: string, font: string, maxW: number): number {
  ctx.font = font
  return text ? wrap(ctx, text, maxW).length : 0
}

// ---------- 도형·이미지 ----------

export function box(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.fillStyle = fill
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fill()
}

export function stroke(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, color: string, width: number) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.stroke()
}

// cover: 꽉 채우고 넘치는 부분 자르기 / contain: 전부 보이게 넣고 남는 곳은 bg
export function drawImage(ctx: Ctx, img: HTMLImageElement, x: number, y: number, w: number, h: number, r: number, mode: 'cover' | 'contain', bg?: string) {
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

// 이미지가 없을 때 쓰는 회색 칸 + 사진 아이콘
export function placeholder(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, bg = '#ecebe8', fg = '#b5b2ab') {
  box(ctx, x, y, w, h, r, bg)
  const s = Math.min(w, h) * 0.3
  const ix = x + (w - s) / 2
  const iy = y + (h - s * 0.8) / 2
  stroke(ctx, ix, iy, s, s * 0.8, s * 0.12, fg, s * 0.07)
  ctx.fillStyle = fg
  ctx.beginPath()
  ctx.moveTo(ix + s * 0.08, iy + s * 0.74)
  ctx.lineTo(ix + s * 0.36, iy + s * 0.36)
  ctx.lineTo(ix + s * 0.58, iy + s * 0.62)
  ctx.lineTo(ix + s * 0.72, iy + s * 0.48)
  ctx.lineTo(ix + s * 0.92, iy + s * 0.74)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.arc(ix + s * 0.7, iy + s * 0.24, s * 0.08, 0, Math.PI * 2)
  ctx.fill()
}

// 사진 꽉 채우기 + 전체 어둡게(dim) + 아래쪽 그라데이션
export function photoBackdrop(ctx: Ctx, image: HTMLImageElement | null, dim: number, gradFrom = 400, gradTo = 0.82) {
  ctx.fillStyle = '#9a9a9a'
  ctx.fillRect(0, 0, W, H)
  if (image) drawImage(ctx, image, 0, 0, W, H, 0, 'cover')
  if (dim) { ctx.fillStyle = `rgba(0,0,0,${dim})`; ctx.fillRect(0, 0, W, H) }
  const shade = ctx.createLinearGradient(0, gradFrom, 0, H)
  shade.addColorStop(0, 'rgba(0,0,0,0)')
  shade.addColorStop(1, `rgba(0,0,0,${gradTo})`)
  ctx.fillStyle = shade
  ctx.fillRect(0, gradFrom, W, H - gradFrom)
}

export function avatarCircle(ctx: Ctx, avatar: HTMLImageElement | null, x: number, y: number, size: number, fallback: string) {
  if (avatar) drawImage(ctx, avatar, x, y, size, size, size / 2, 'cover', '#f1f2f4')
  else box(ctx, x, y, size, size, size / 2, fallback)
}

export function arrow(ctx: Ctx, y: number, color: string, width = 3, x1 = 892, x2 = 1010) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, y)
  ctx.lineTo(x2, y)
  ctx.moveTo(x2 - 14, y - 10)
  ctx.lineTo(x2, y)
  ctx.lineTo(x2 - 14, y + 10)
  ctx.stroke()
}
