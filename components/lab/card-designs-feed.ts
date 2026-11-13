// 사용자가 준 참고 템플릿 10종(박스 정리·말풍선 포토·센터 매거진·기록 로그·데스크톱 창·형광펜 메모·카메라 UI·글자 타일·블로그 글·태그 포토)을
// 카드뉴스 문법(`#` 제목·`**` 포인트·`>` 강조·본문)에 맞춰 캔버스로 다시 그린 렌더러
import { AUTHOR_NAME, SITE_DOMAIN_NAME } from '@/lib/site'
import {
  H, SANS, SERIF, W, X, arrow, avatarCircle, box, clampLines, countLines, drawImage, drawText, drawTitle, fit, oneLine, pad,
  pageLabel, photoBackdrop, placeholder, plainTitle, stroke, titleLines, wrap,
  type Ctx, type DrawInput,
} from './card-canvas'

export const FEED_DESIGNS = {
  boxes: '박스 정리형',
  bubble: '말풍선 포토',
  magazine: '센터 매거진',
  log: '기록 로그',
  desktop: '데스크톱 창',
  highlight: '형광펜 메모',
  camera: '카메라 UI',
  tiles: '글자 타일',
  blogpost: '블로그 글',
  tag: '태그 포토',
} as const

const HANDLE = `@${SITE_DOMAIN_NAME}`
const paragraphs = (t: string) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
const lines = (t: string) => t.split('\n').map((l) => l.trim()).filter(Boolean)

function lights(ctx: Ctx, x: number, y: number, r = 9) {
  ;['#ff5f56', '#ffbd2e', '#27c93f'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x + i * r * 2.9, y, r, 0, Math.PI * 2)
    ctx.fill()
  })
}

// ---------- 박스 정리형: 흰 바탕, 검은 라벨 · 파란 강조 박스 · 큰 가운데 글 · 테두리 상자 ----------

function boxes(ctx: Ctx, d: DrawInput) {
  const { card, kind, image } = d
  const INK = '#111111'
  const BLUE = '#5aaee8'
  const CX = W / 2
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  let y = 140
  const label = kind === 'body' ? plainTitle(card.title) : SITE_DOMAIN_NAME
  if (label) {
    const text = oneLine(ctx, label, `700 48px ${SANS}`, 860)
    const w = ctx.measureText(text).width + 90
    box(ctx, CX - w / 2, y, w, 104, 0, INK)
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(text, CX, y + 27)
    ctx.textAlign = 'left'
    y += 104 + 76
  }

  const [first, ...restQuotes] = card.quotes
  if (first) {
    const text = oneLine(ctx, first, `800 64px ${SANS}`, 820)
    const w = ctx.measureText(text).width + 70
    box(ctx, CX - w / 2, y, w, 106, 0, BLUE)
    stroke(ctx, CX - w / 2, y, w, 106, 0, INK, 3)
    ctx.fillStyle = INK
    ctx.textAlign = 'center'
    ctx.fillText(text, CX, y + 20)
    ctx.textAlign = 'left'
    y += 106 + 36
  }

  // 큰 가운데 글: 표지·마지막은 제목, 본문은 첫 문단
  const paras = paragraphs(card.body)
  const big = kind === 'body' ? paras.shift() ?? '' : card.title
  if (big) {
    const size = plainTitle(big).length > 40 ? 46 : 72
    y += drawTitle(ctx, big, CX, y, 880, size, 4, INK, INK, { align: 'center', weight: 500, lineHeight: 1.45, marker: BLUE }) + 50
  }

  // 나머지 문단·강조 문장은 테두리 상자
  const items = kind === 'body' ? [...paras, ...restQuotes] : [...(kind === 'cover' ? paras : []), ...restQuotes]
  ctx.font = `400 38px ${SANS}`
  for (const item of items) {
    const shown = clampLines(wrap(ctx, item, 820), fit(1190 - y - 56, 64, 4))
    if (!shown.length) break
    const h = shown.length * 64 + 56
    stroke(ctx, 90, y, 900, h, 0, INK, 3)
    ctx.fillStyle = INK
    ctx.textAlign = 'center'
    shown.forEach((l, i) => ctx.fillText(l, CX, y + 30 + i * 64))
    ctx.textAlign = 'left'
    y += h + 36
  }

  if (image && 1190 - y > 220) {
    const h = Math.min(1190 - y, 480)
    drawImage(ctx, image, 90, y, 900, h, 0, 'contain', '#f4f4f4')
    stroke(ctx, 90, y, 900, h, 0, INK, 3)
  }

  ctx.font = `800 36px ${SANS}`
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.fillText(HANDLE, CX, 1258)
  ctx.textAlign = 'left'
}

// ---------- 말풍선 포토: 사진 + 꼬리 달린 흰 말풍선 + 하단 흰 글 ----------

function speechBubble(ctx: Ctx, text: string, x: number, y: number): number {
  const t = oneLine(ctx, text, `500 44px ${SANS}`, 800)
  const w = ctx.measureText(t).width + 80
  const h = 96
  box(ctx, x, y, w, h, h / 2, '#ffffff')
  ctx.beginPath()
  ctx.moveTo(x + 26, y + h - 24)
  ctx.quadraticCurveTo(x + 10, y + h + 6, x - 14, y + h + 12)
  ctx.quadraticCurveTo(x + 34, y + h + 6, x + 64, y + h - 8)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#1c1c1e'
  ctx.fillText(t, x + 40, y + 24)
  return h
}

function bubble(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, index, total, accent } = d
  photoBackdrop(ctx, image, 0, 500, 0.85)
  const quote = kind === 'outro' ? plainTitle(card.title).replace(/\n/g, ' ') : card.quotes[0]
  const title = kind === 'outro' ? '' : card.title
  const tSize = kind === 'cover' ? 88 : 58
  const tMax = kind === 'cover' ? 3 : 2
  const tLines = titleLines(ctx, title, tSize, 860, tMax)
  const bodyFont = `400 40px ${SANS}`
  const bLines = kind === 'body' ? Math.min(countLines(ctx, card.body, bodyFont, 860), 6) : 0
  const handleH = kind === 'body' ? 0 : 60
  const sum = (quote ? 130 : 0) + tLines * tSize * 1.25 + (tLines && bLines ? 20 : 0) + bLines * 60 + handleH

  let y = 1250 - sum
  if (quote) y += speechBubble(ctx, quote, X + 10, y) + 34
  y += drawTitle(ctx, title, X, y, 860, tSize, tMax, '#ffffff', accent)
  if (tLines && bLines) y += 20
  if (kind === 'body') y += drawText(ctx, card.body, X, y, 860, bodyFont, '#ffffff', 60, bLines)
  if (handleH) {
    drawText(ctx, HANDLE, X, y + 18, 800, `400 30px ${SANS}`, 'rgba(255,255,255,0.8)', 40, 1)
  } else {
    ctx.font = `400 30px ${SANS}`
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.textAlign = 'right'
    ctx.fillText(`${index + 1}/${total}`, W - X, 1255)
    ctx.textAlign = 'left'
  }
}

// ---------- 센터 매거진: 사진 + 꺾쇠 라벨 / 흰 가격표 상자 / 가운데 제목 + 세리프 브랜드 ----------

function bracketLabel(ctx: Ctx, text: string, x: number, y: number) {
  const t = oneLine(ctx, text, `500 40px ${SANS}`, 700)
  const w = ctx.measureText(t).width
  ctx.fillStyle = '#ffffff'
  ctx.fillText(t, x + 32, y + 10)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(x, y + 22)
  ctx.lineTo(x, y + 62)
  ctx.lineTo(x + 22, y + 62)
  ctx.moveTo(x + w + 42, y)
  ctx.lineTo(x + w + 64, y)
  ctx.lineTo(x + w + 64, y + 40)
  ctx.stroke()
}

function magazine(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, accent } = d
  const CX = W / 2
  photoBackdrop(ctx, image, 0.3, 500, 0.75)
  ctx.font = `italic 700 46px ${SERIF}`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.fillText(SITE_DOMAIN_NAME, CX, 1236)
  ctx.textAlign = 'left'

  if (kind === 'cover') {
    const label = card.quotes[0]
    const tL = titleLines(ctx, card.title, 92, 860, 3)
    const subFont = `400 36px ${SANS}`
    const sL = Math.min(countLines(ctx, card.body, subFont, 860), 2)
    let y = 1170 - (label ? 92 : 0) - tL * 115 - (sL ? 20 + sL * 52 : 0)
    if (label) { bracketLabel(ctx, label, X, y); y += 92 }
    y += drawTitle(ctx, card.title, X, y, 860, 92, 3, '#ffffff', accent)
    if (sL) drawText(ctx, card.body, X, y + 20, 860, subFont, 'rgba(255,255,255,0.85)', 52, sL)
    return
  }

  // 본문: 강조 문장은 사진 위 흰 가격표 상자
  if (kind === 'body') {
    card.quotes.slice(0, 2).forEach((q, i) => {
      const t = oneLine(ctx, q, `500 32px ${SANS}`, 700)
      const w = ctx.measureText(t).width + 36
      const x = i === 0 ? CX - w / 2 : W - X - w
      const y = i === 0 ? 150 : 560
      box(ctx, x, y, w, 62, 0, '#ffffff')
      stroke(ctx, x, y, w, 62, 0, '#222222', 2)
      ctx.fillStyle = '#222222'
      ctx.fillText(t, x + 18, y + 14)
    })
  }

  const tSize = kind === 'outro' ? 84 : 70
  const tL = titleLines(ctx, card.title, tSize, 880, 3)
  const bodyFont = `400 34px ${SANS}`
  const bL = kind === 'body' ? Math.min(countLines(ctx, card.body, bodyFont, 860), 3) : 0
  let y = 1170 - tL * tSize * 1.25 - (bL ? 24 + bL * 50 : 0)
  y += drawTitle(ctx, card.title, CX, y, 880, tSize, 3, '#ffffff', accent, { align: 'center' })
  if (bL) drawText(ctx, card.body, CX, y + 24, 860, bodyFont, 'rgba(255,255,255,0.85)', 50, bL, 'center')
}

// ---------- 기록 로그: 사진 + 주황 점 라벨, 표지는 수치 3칸, 본문은 시간표 줄 ----------
// 본문 줄을 `왼쪽 | 오른쪽`으로 쓰면 두 칸으로 나뉜다 (왼쪽을 **로 감싸면 주황)

function log(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, index } = d
  const ORANGE = '#ff6a2b'
  const SOFT = 'rgba(255,255,255,0.8)'
  photoBackdrop(ctx, image, 0.25, 450, 0.8)

  ctx.fillStyle = ORANGE
  ctx.beginPath()
  ctx.arc(X + 14, 104, 14, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = `700 36px ${SANS}`
  ctx.fillStyle = '#ffffff'
  ctx.fillText(kind === 'body' ? `기록 ${pad(index)}` : '기록', X + 40, 84)
  ctx.font = `400 32px ${SANS}`
  ctx.fillStyle = SOFT
  ctx.textAlign = 'right'
  ctx.fillText(pageLabel(d), W - X, 86)
  ctx.textAlign = 'left'

  const rows = lines(card.body).map((l) => {
    const parts = l.split(/\s*\|\s*/)
    return parts.length > 1 ? { k: parts[0], v: parts.slice(1).join(' | ') } : { k: '', v: l }
  })

  if (kind === 'cover') {
    const stats = rows.filter((r) => r.k).slice(0, 3)
    const rest = rows.filter((r) => !r.k).map((r) => r.v).join(' ')
    const tL = titleLines(ctx, card.title, 104, 860, 3)
    drawTitle(ctx, card.title, X, 1060 - tL * 130, 860, 104, 3, '#ffffff', ORANGE)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillRect(X, 1090, W - X * 2, 2)
    if (stats.length) {
      stats.forEach((s, i) => {
        drawText(ctx, s.k, X + i * 300, 1120, 280, `400 28px ${SANS}`, 'rgba(255,255,255,0.75)', 36, 1)
        drawText(ctx, s.v, X + i * 300, 1164, 280, `700 42px ${SANS}`, '#ffffff', 50, 1)
      })
    } else {
      drawText(ctx, rest, X, 1120, 900, `400 36px ${SANS}`, 'rgba(255,255,255,0.9)', 52, 2)
    }
    return
  }

  if (kind === 'outro') {
    const CX = W / 2
    drawText(ctx, plainTitle(card.title).split('\n')[0], CX, 520, 900, `400 38px ${SANS}`, 'rgba(255,255,255,0.9)', 50, 1, 'center')
    ctx.font = `800 120px ${SANS}`
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(oneLine(ctx, SITE_DOMAIN_NAME, `800 120px ${SANS}`, 960), CX, 590)
    ctx.font = `400 34px ${SANS}`
    const t = HANDLE
    const tw = ctx.measureText(t).width
    ctx.fillStyle = ORANGE
    ctx.beginPath()
    ctx.arc(CX - tw / 2 - 26, 782, 13, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText(t, CX + 12, 764)
    ctx.textAlign = 'left'
    return
  }

  // 본문: 제목 + 시간표 줄(아래에 붙여 쌓기), 강조 문장은 맨 아래 작은 글
  const footer = card.quotes[0]
  const tL = titleLines(ctx, card.title, 56, 900, 2)
  const keyed = rows.some((r) => r.k)
  const ROW = 96
  const shown = keyed ? rows.slice(0, 6) : []
  const bodyFont = `400 38px ${SANS}`
  const bL = keyed ? 0 : Math.min(countLines(ctx, card.body, bodyFont, 900), 7)
  let y = 1240 - (footer ? 60 : 0) - shown.length * ROW - bL * 56 - (tL ? tL * 70 + 30 : 0)
  y += drawTitle(ctx, card.title, X, y, 900, 56, 2, '#ffffff', ORANGE)
  if (tL) y += 30
  for (const r of shown) {
    if (r.k) {
      drawTitle(ctx, r.k, X, y + 26, 180, 40, 1, '#ffffff', ORANGE)
      drawText(ctx, r.v, X + 190, y + 26, 710, bodyFont, '#ffffff', 48, 1)
    } else {
      drawText(ctx, r.v, X, y + 26, 900, bodyFont, '#ffffff', 48, 1)
    }
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.fillRect(X - 8, y + ROW, W - X * 2 + 16, 2)
    y += ROW
  }
  y += drawText(ctx, keyed ? '' : card.body, X, y, 900, bodyFont, '#ffffff', 56, bL)
  if (footer) drawText(ctx, footer, X, y + 24, 900, `400 30px ${SANS}`, 'rgba(255,255,255,0.75)', 40, 1)
}

// ---------- 데스크톱 창: 메뉴 막대 + 바탕화면 아이콘 + 파인더 창(표지) / 사진 창 + 음악 위젯(본문) ----------

const MENU = ['사진', '파일', '편집', '보기', '이동', '도구', '윈도우', '도움말']
const ICONS: [string, string][] = [['📷', '사진'], ['🫧', '기록'], ['🖍️', '작업'], ['⏰', '알람']]

function desktop(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, accent } = d
  const INK = '#1c1c1e'
  const MUTED = '#8e8e93'
  ctx.fillStyle = '#f3f2f7'
  ctx.fillRect(0, 0, W, H)

  let mx = 60
  MENU.forEach((m, i) => {
    ctx.font = `${i === 0 ? 700 : 400} 28px ${SANS}`
    ctx.fillStyle = INK
    ctx.fillText(m, mx, 40)
    mx += ctx.measureText(m).width + 28
  })
  ctx.textAlign = 'center'
  ICONS.forEach(([emoji, label], i) => {
    const iy = 230 + i * 210
    ctx.font = `72px ${SANS}`
    ctx.fillText(emoji, 120, iy)
    ctx.font = `400 26px ${SANS}`
    ctx.fillStyle = INK
    ctx.fillText(label, 120, iy + 100)
  })
  ctx.textAlign = 'left'

  const WX = 230
  const WY = 190
  const WW = W - WX - 40

  if (kind !== 'body') {
    // 파인더 창: 왼쪽 사이드바 목록 + 오른쪽 썸네일
    const WH = 700
    box(ctx, WX, WY, WW, WH, 28, '#ffffff')
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(WX, WY, WW, WH, 28)
    ctx.clip()
    ctx.fillStyle = '#e9e8ee'
    ctx.fillRect(WX, WY, 250, WH)
    ctx.restore()
    lights(ctx, WX + 36, WY + 48)
    const side: [string, number][] = [['즐겨찾기', 1], ['최근 항목', 0], ['응용 프로그램', 0], ['데스크탑', 0], ['문서', 0], ['다운로드', 0], ['☆ 카드뉴스', 2], ['공유', 1], [SITE_DOMAIN_NAME, 0]]
    let sy = WY + 104
    side.forEach(([t, f]) => {
      if (f === 2) box(ctx, WX + 10, sy - 14, 230, 62, 14, '#d9d8df')
      ctx.font = f === 1 ? `500 22px ${SANS}` : `400 26px ${SANS}`
      ctx.fillStyle = f === 1 ? MUTED : INK
      ctx.fillText(oneLine(ctx, t, ctx.font, 200), WX + 30, sy)
      sy += f === 1 ? 46 : 58
    })
    ctx.font = `400 44px ${SANS}`
    ctx.fillStyle = MUTED
    ctx.fillText('‹   ›', WX + 290, WY + 26)
    const tx = WX + 300
    const ty = WY + 120
    if (image) drawImage(ctx, image, tx, ty, 220, 220, 8, 'cover')
    else placeholder(ctx, tx, ty, 220, 220, 0)
    drawText(ctx, `·° ${kind === 'outro' ? '끝' : '오늘'} °·`, tx + 110, ty + 236, 300, `400 24px ${SANS}`, INK, 30, 1, 'center')
    ctx.fillStyle = '#e5e5ea'
    ctx.fillRect(WX + 250, WY + WH - 62, WW - 250, 2)
    drawText(ctx, SITE_DOMAIN_NAME, WX + 290, WY + WH - 44, 400, `400 22px ${SANS}`, MUTED, 28, 1)

    let y = WY + WH + 60
    y += drawTitle(ctx, card.title, WX, y, 800, 62, 2, INK, accent) + 14
    drawText(ctx, card.body, WX, y, 800, `400 34px ${SANS}`, MUTED, 48, 2)
    return
  }

  // 본문: 사진 창 + 음악 위젯 + 라벨
  box(ctx, WX, WY + 40, WW, 760, 0, '#ebeaf0')
  lights(ctx, WX + 30, WY + 78)
  const ix = WX + 12
  const iy = WY + 110
  const iw = WW - 12
  const ih = 520
  if (image) drawImage(ctx, image, ix, iy, iw, ih, 0, 'cover')
  else placeholder(ctx, ix, iy, iw, ih, 0, '#dcdbe2', '#b0afb8')

  const px = WX + 40
  const py = iy + ih - 60
  const pw = 300
  const ph = 140
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.12)'
  ctx.shadowBlur = 20
  box(ctx, px, py, pw, ph, 20, '#ffffff')
  ctx.restore()
  lights(ctx, px + 24, py + 26, 6)
  ctx.font = `400 18px ${SANS}`
  ctx.fillStyle = MUTED
  ctx.fillText('1:46', px + 20, py + 52)
  ctx.textAlign = 'right'
  ctx.fillText('-1:16', px + pw - 20, py + 52)
  ctx.fillStyle = '#d1d1d6'
  ctx.fillRect(px + 64, py + 61, pw - 140, 4)
  ctx.fillStyle = MUTED
  ctx.fillRect(px + 64, py + 61, (pw - 140) * 0.55, 4)
  ctx.font = `400 28px ${SANS}`
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.fillText('◀◀    ▶    ▶▶', px + pw / 2, py + 88)
  ctx.textAlign = 'left'

  const ly = iy + ih + 110
  drawText(ctx, `·° ${plainTitle(card.title) || '오늘의 기록'} °·`, px + 10, ly, 520, `500 30px ${SANS}`, INK, 40, 1)
  ctx.font = `400 26px ${SANS}`
  ctx.fillStyle = MUTED
  ctx.textAlign = 'right'
  ctx.fillText(pageLabel(d), WX + WW - 30, ly + 4)
  ctx.textAlign = 'left'
  drawText(ctx, card.body, px + 10, ly + 60, WW - 60, `400 32px ${SANS}`, '#3a3a3c', 46, fit(1300 - (ly + 60), 46, 4))
}

// ---------- 형광펜 메모: 메모 앱 머리 + 가운데 정렬 글 + 노란 형광펜 + 회색 체크 상자 ----------

const CIRCLED = '❶❷❸❹❺❻❼❽❾❿'

// 본문 줄을 가운데 정렬로, `**줄 전체**`면 굵게
function centerLines(ctx: Ctx, text: string, y: number, maxLines: number): number {
  let used = 0
  let h = 0
  for (const raw of lines(text)) {
    const bold = /^\*\*.*\*\*$/.test(raw)
    const font = `${bold ? 700 : 400} 38px ${SANS}`
    ctx.font = font
    const wrapped = wrap(ctx, raw.replace(/\*\*/g, ''), 880)
    const take = clampLines(wrapped, Math.min(wrapped.length, maxLines - used))
    if (!take.length) break
    h += drawText(ctx, take.join('\n'), W / 2, y + h, 880, font, '#1c1c1e', 58, take.length, 'center')
    used += take.length
  }
  return h
}

function highlight(ctx: Ctx, d: DrawInput) {
  const { card, kind, index } = d
  const INK = '#1c1c1e'
  const YEL = '#f5b800'
  const MARK = '#fdf77a'
  const CX = W / 2
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  ctx.font = `500 52px ${SANS}`
  ctx.fillStyle = YEL
  ctx.fillText('‹', 40, 44)
  ctx.font = `500 42px ${SANS}`
  ctx.fillText(HANDLE, 90, 54)
  ctx.strokeStyle = YEL
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(790, 76)
  ctx.lineTo(790, 106)
  ctx.lineTo(830, 106)
  ctx.lineTo(830, 76)
  ctx.moveTo(810, 50)
  ctx.lineTo(810, 90)
  ctx.moveTo(797, 63)
  ctx.lineTo(810, 50)
  ctx.lineTo(823, 63)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(940, 80, 26, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = YEL
  ;[-10, 0, 10].forEach((dx) => { ctx.beginPath(); ctx.arc(940 + dx, 80, 3.5, 0, Math.PI * 2); ctx.fill() })

  let y = 190
  if (kind === 'cover') {
    drawText(ctx, pageLabel(d), CX, y, 900, `400 30px ${SANS}`, '#8e8e93', 40, 1, 'center')
    y += 100
    y += drawTitle(ctx, card.title, CX, y, 900, 92, 4, INK, INK, { align: 'center', marker: MARK, lineHeight: 1.3 }) + 60
    centerLines(ctx, card.body, y, 4)
    arrow(ctx, 1270, INK, 4, 880, 990)
    return
  }

  const raw = kind === 'body' ? `${CIRCLED[index - 1] ?? `${index}.`} ${card.title}` : card.title
  const marked = /\*\*/.test(raw) ? raw : `**${raw}**`
  y += drawTitle(ctx, marked, CX, y, 900, 60, 2, INK, INK, { align: 'center', marker: MARK }) + 50
  y += centerLines(ctx, card.body, y, fit(1180 - y, 58, 8)) + 40

  // 강조 문장: 회색 상자 안 체크리스트
  const items = card.quotes.slice(0, Math.max(0, Math.floor((1200 - y - 70) / 70)))
  if (items.length) {
    const h = items.length * 70 + 70
    box(ctx, 90, y, 900, h, 28, '#f0f0f5')
    items.forEach((q, i) => drawText(ctx, `✅ ${q}`, 150, y + 40 + i * 70, 800, `400 36px ${SANS}`, '#3a3a3c', 50, 1))
  }
  if (kind !== 'outro') arrow(ctx, 1270, INK, 4, 880, 990)
}

// ---------- 카메라 UI: 검은 화면 + 사진 + 노란 인식 상자 라벨 + 모드 줄 + 셔터 ----------

function camera(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, index } = d
  const YEL = '#ffd60a'
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, W, H)
  ctx.font = `700 40px ${SANS}`
  ctx.fillStyle = '#ffffff'
  ctx.fillText(pageLabel(d), 60, 64)
  ctx.textAlign = 'right'
  ctx.fillText('HDR', W - 60, 64)
  ctx.textAlign = 'left'

  const PY = 170
  const PH = 820
  if (image) drawImage(ctx, image, 0, PY, W, PH, 0, 'cover')
  else placeholder(ctx, 0, PY, W, PH, 0, '#2a2a2a', '#555555')

  // 인식 상자 + 제목 라벨
  const fw = 440
  const fx = (W - fw) / 2
  const fy = PY + 180
  stroke(ctx, fx, fy, fw, 460, 0, YEL, 4)
  const label = oneLine(ctx, plainTitle(card.title), `700 40px ${SANS}`, 860)
  if (label) {
    const lw = ctx.measureText(label).width + 48
    box(ctx, (W - lw) / 2, fy - 76, lw, 64, 18, YEL)
    ctx.fillStyle = '#111111'
    ctx.textAlign = 'center'
    ctx.fillText(label, W / 2, fy - 64)
    ctx.textAlign = 'left'
  }

  // 모드 줄: 본문 줄 2~3개, 가운데가 노란색
  const modes = kind === 'outro' ? [] : lines(card.body).slice(0, 3)
  ctx.textAlign = 'center'
  if (modes.length >= 2) {
    const xs = modes.length === 3 ? [W / 2 - 300, W / 2, W / 2 + 300] : [W / 2 - 180, W / 2 + 180]
    modes.forEach((m, i) => {
      ctx.font = `500 38px ${SANS}`
      ctx.fillStyle = i === 1 ? YEL : '#d1d1d6'
      ctx.fillText(oneLine(ctx, m, ctx.font, 280), xs[i], 1030)
    })
  } else if (modes[0]) {
    ctx.fillStyle = YEL
    ctx.fillText(oneLine(ctx, modes[0], `500 36px ${SANS}`, 960), W / 2, 1030)
  }
  ctx.textAlign = 'left'

  // 셔터 · 썸네일 · 장 수
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 12
  ctx.beginPath()
  ctx.arc(W / 2, 1225, 92, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(W / 2, 1225, 72, 0, Math.PI * 2)
  ctx.fill()
  if (image) drawImage(ctx, image, 140, 1170, 110, 110, 6, 'cover')
  else placeholder(ctx, 140, 1170, 110, 110, 0)
  ctx.font = `500 36px ${SANS}`
  ctx.fillStyle = '#d1d1d6'
  ctx.textAlign = 'right'
  ctx.fillText(`${index + 1}장째`, W - 90, 1205)
  ctx.textAlign = 'left'
}

// ---------- 글자 타일: 물방울 무늬 바탕 + 제목 글자마다 기운 색 타일 ----------

const TILE_COLORS = ['#ffffff', '#fbe08a', '#f4b9a6', '#a9d4f5', '#7ea6ee']
const TILT = [-3, 2, -2, 3, -1]
const JITTER = [-20, 18, -8, 22, -16]

function tileRows(text: string, perRow: number): (string | null)[][] {
  const rows: (string | null)[][] = []
  let row: (string | null)[] = []
  const count = (r: (string | null)[]) => r.filter(Boolean).length
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const chars = Array.from(word)
    if (row.length && count(row) + chars.length > perRow) { rows.push(row); row = [] }
    for (const ch of chars) {
      if (count(row) >= perRow) { rows.push(row); row = [] }
      row.push(ch)
    }
    row.push(null)
  }
  if (count(row)) rows.push(row)
  return rows.map((r) => (r[r.length - 1] === null ? r.slice(0, -1) : r))
}

function tiles(ctx: Ctx, d: DrawInput) {
  const { card, kind, image } = d
  const INK = '#111111'
  ctx.fillStyle = '#eef3ff'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#dde7fb'
  for (let r = 0; r < 12; r++) {
    for (let c = -1; c < 6; c++) {
      ctx.beginPath()
      ctx.arc(c * 256 + (r % 2 ? 0 : 128) + 64, r * 128 + 64, 48, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const text = Array.from(plainTitle(card.title).replace(/\n/g, ' ')).slice(0, 24).join('')
  const total = Array.from(text.replace(/\s/g, '')).length
  const perRow = Math.min(6, Math.max(1, total))
  const rows = tileRows(text, perRow)
  const size = Math.min(170, 860 / (perRow + 0.6))
  const rowGap = size * 1.25
  const blockH = rows.length * rowGap
  let y = kind === 'body' ? 200 : (H - blockH) / 2 - 40
  let n = 0
  for (const row of rows) {
    const widths = row.map((c) => (c ? size : size * 0.3))
    let x = (W - widths.reduce((a, b) => a + b + 8, -8)) / 2
    row.forEach((ch, i) => {
      if (ch) {
        ctx.save()
        ctx.translate(x + size / 2, y + size / 2 + JITTER[n % JITTER.length] * (size / 170))
        ctx.rotate((TILT[n % TILT.length] * Math.PI) / 180)
        box(ctx, -size / 2, -size * 0.42, size, size * 0.84, 4, TILE_COLORS[n % TILE_COLORS.length])
        stroke(ctx, -size / 2, -size * 0.42, size, size * 0.84, 4, INK, 4)
        ctx.font = `800 ${Math.round(size * 0.58)}px ${SANS}`
        ctx.fillStyle = INK
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(ch, 0, 4)
        ctx.restore()
        n++
      }
      x += widths[i] + 8
    })
    y += rowGap
  }
  ctx.textBaseline = 'top'

  if (kind === 'body') {
    y += 40
    y += drawText(ctx, card.body, W / 2, y, 860, `500 40px ${SANS}`, INK, 60, fit(1200 - y, 60, image ? 4 : 9), 'center')
    ctx.font = `700 32px ${SANS}`
    for (const q of card.quotes.slice(0, 2)) {
      if (y + 90 > 1200) break
      const t = oneLine(ctx, q, ctx.font, 800)
      const w = ctx.measureText(t).width + 48
      y += 30
      box(ctx, (W - w) / 2, y, w, 64, 32, '#ffffff')
      stroke(ctx, (W - w) / 2, y, w, 64, 32, INK, 3)
      ctx.fillStyle = INK
      ctx.textAlign = 'center'
      ctx.fillText(t, W / 2, y + 16)
      ctx.textAlign = 'left'
      y += 64
    }
    if (image && 1200 - y > 220) {
      const h = Math.min(1200 - y - 30, 460)
      drawImage(ctx, image, 140, y + 30, 800, h, 16, 'contain', '#ffffff')
      stroke(ctx, 140, y + 30, 800, h, 16, INK, 4)
    }
  } else if (card.body) {
    drawText(ctx, card.body, W / 2, y + 30, 860, `500 38px ${SANS}`, '#3a3f55', 56, 2, 'center')
  }

  ctx.font = `700 32px ${SANS}`
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.fillText(HANDLE, W / 2, 1262)
  ctx.textAlign = 'left'
}

// ---------- 블로그 글: 카테고리 · 큰 제목 · 글쓴이 줄 + 구독 버튼 · 사진 · 본문 ----------

function blogpost(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, avatar, accent } = d
  const INK = '#111111'
  const MUTED = '#777777'
  const GREEN = '#2e7d32'
  const BX = 100
  const bw = W - BX * 2
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  let y = 110
  drawText(ctx, SITE_DOMAIN_NAME, BX, y, bw, `400 34px ${SANS}`, MUTED, 44, 1)
  y += 64
  y += drawTitle(ctx, card.title, BX, y, bw, kind === 'body' ? 60 : 72, 3, INK, accent) + 36

  avatarCircle(ctx, avatar, BX, y, 96, '#ecebe8')
  drawText(ctx, AUTHOR_NAME, BX + 124, y + 8, 400, `700 36px ${SANS}`, INK, 44, 1)
  drawText(ctx, pageLabel(d), BX + 124, y + 56, 400, `400 30px ${SANS}`, MUTED, 36, 1)
  ctx.font = `700 32px ${SANS}`
  const bt = '+ 구독'
  const btw = ctx.measureText(bt).width + 56
  stroke(ctx, BX + bw - btw, y + 18, btw, 66, 16, GREEN, 3)
  ctx.fillStyle = GREEN
  ctx.fillText(bt, BX + bw - btw + 28, y + 34)
  y += 96 + 40
  ctx.fillStyle = '#eeeeee'
  ctx.fillRect(BX, y, bw, 3)
  y += 40

  const text = [card.body, ...card.quotes.map((q) => `“${q}”`)].filter(Boolean).join('\n')
  const bodyFont = `400 34px ${SANS}`
  const bL = Math.min(countLines(ctx, text, bodyFont, bw), image ? 3 : 6)
  const imgH = 1250 - y - (bL ? bL * 50 + 40 : 0)
  if (imgH > 200) {
    if (image) drawImage(ctx, image, BX, y, bw, imgH, 0, 'cover')
    else placeholder(ctx, BX, y, bw, imgH, 0)
    y += imgH + 40
  }
  drawText(ctx, text, BX, y, bw, bodyFont, '#555555', 50, fit(1300 - y, 50, bL))
}

// ---------- 태그 포토: 사진 + 강조색 태그 상자 + 큰 흰 제목 + 부제 + 계정 ----------

function tag(ctx: Ctx, d: DrawInput) {
  const { card, kind, image, index, accent } = d
  photoBackdrop(ctx, image, 0, 450, 0.85)
  const label = card.quotes[0] ?? (kind === 'cover' ? SITE_DOMAIN_NAME : kind === 'outro' ? '' : pad(index))
  const tSize = kind === 'body' ? 64 : 100
  const tL = titleLines(ctx, card.title, tSize, 880, 3)
  const bodyFont = `400 40px ${SANS}`
  const bL = Math.min(countLines(ctx, card.body, bodyFont, 880), kind === 'body' ? 5 : 2)
  let y = 1270 - (label ? 132 : 0) - tL * tSize * 1.2 - (bL ? 28 + bL * 56 : 0) - 80

  if (label) {
    const t = oneLine(ctx, label, `700 44px ${SANS}`, 800)
    const w = ctx.measureText(t).width + 56
    box(ctx, X, y, w, 96, 0, accent)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(t, X + 28, y + 24)
    y += 132
  }
  y += drawTitle(ctx, card.title, X, y, 880, tSize, 3, '#ffffff', '#ffd60a', { lineHeight: 1.2 })
  if (bL) y += 28 + drawText(ctx, card.body, X, y + 28, 880, bodyFont, 'rgba(255,255,255,0.9)', 56, bL)
  drawText(ctx, HANDLE, X, y + 40, 800, `400 32px ${SANS}`, 'rgba(255,255,255,0.8)', 40, 1)
}

export const FEED_RENDERERS: Record<keyof typeof FEED_DESIGNS, (ctx: Ctx, d: DrawInput) => void> = {
  boxes, bubble, magazine, log, desktop, highlight, camera, tiles, blogpost, tag,
}
