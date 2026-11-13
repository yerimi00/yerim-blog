// 카드뉴스 텍스트 형식: 카드는 `---` 줄로 나누고, `#`로 시작하는 줄은 카드 제목, `>`로 시작하는 줄은 강조 박스,
// `![](주소)` 줄은 그 카드의 이미지, ``` 코드 블록은 코드(터미널 디자인만 그림), 나머지는 본문. 제목 안 `**단어**`는 포인트 색. `---`가 없으면 빈 줄(문단) 단위로 나눈다 — 뉴스 본문을 그대로 붙여넣는 경우
export type Card = { title: string; body: string; quotes: string[]; image?: string; code?: string }

const IMAGE_LINE = /^!\[[^\]]*\]\((\S+?)\)\s*$/
// 마크다운 이미지 또는 콜아웃 안 <img> (lib/notion.ts 콜아웃 변환)
const FIRST_IMAGE = /!\[[^\]]*\]\((\S+?)\)|<img[^>]+src="([^"]+)"/

const BODY_LIMIT = 180
const CODE_LINES = 10
const FENCE = /```[^\n]*\n([\s\S]*?)```/

export function parseCards(text: string): Card[] {
  const src = text.replace(/\r\n/g, '\n').trim()
  if (!src) return []
  const chunks = /^-{3,}\s*$/m.test(src) ? src.split(/^-{3,}\s*$/m) : src.split(/\n\s*\n/)
  return chunks
    .map((raw) => {
      // 코드 안 `#` 주석이 제목으로 읽히지 않게 코드 블록을 먼저 떼어 낸다
      const code = raw.match(FENCE)?.[1].replace(/\s+$/, '')
      const chunk = raw.replace(FENCE, '')
      const lines = chunk.trim().split('\n')
      const title = lines.filter((l) => l.startsWith('#')).map((l) => l.replace(/^#+\s*/, '')).join(' ')
      const quotes = lines.filter((l) => l.startsWith('>')).map((l) => l.replace(/^>\s*/, '')).filter(Boolean)
      const image = lines.map((l) => l.trim().match(IMAGE_LINE)?.[1]).find(Boolean)
      const body = lines.filter((l) => !l.startsWith('#') && !l.startsWith('>') && !IMAGE_LINE.test(l.trim())).join('\n').trim()
      const card: Card = { title, body, quotes }
      if (image) card.image = image
      if (code) card.code = code
      return card
    })
    .filter((c) => c.title || c.body || c.quotes.length || c.code)
}

// 제목의 `**단어**`를 [글자, 강조 여부] 조각으로 나눈다
export function splitHighlight(text: string): { text: string; hi: boolean }[] {
  return text.split(/\*\*(.+?)\*\*/).map((t, i) => ({ text: t, hi: i % 2 === 1 })).filter((s) => s.text)
}

// 마크다운 문법을 걷어내고 카드에 쓸 글자만 남긴다. 코드 블록·이미지·표는 버린다
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .filter((l) => !l.trim().startsWith('|'))
    .map((l) => l.replace(/^\s*>\s?/, '').replace(/^\s*[-*+]\s+/, '• ').replace(/(\*\*|__|`|~~)/g, '').trim())
    .join('\n')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function clip(text: string): string {
  return text.length > BODY_LIMIT ? `${text.slice(0, BODY_LIMIT).trimEnd()}…` : text
}

function firstImage(md: string): string | undefined {
  const m = md.match(FIRST_IMAGE)
  return m ? m[1] ?? m[2] : undefined
}

const imageLine = (url?: string) => (url ? `![](${url})\n` : '')

// 구간의 첫 코드 블록을 앞 CODE_LINES줄만 남겨 다시 감싼다
function firstCode(md: string): string {
  const m = md.match(/```([^\n]*)\n([\s\S]*?)```/)
  if (!m) return ''
  const lines = m[2].replace(/\s+$/, '').split('\n')
  const kept = lines.length > CODE_LINES ? [...lines.slice(0, CODE_LINES), '…'] : lines
  return `\n\`\`\`${m[1]}\n${kept.join('\n')}\n\`\`\``
}

// 블로그 글 → 카드뉴스 텍스트. 표지(제목·설명·커버 또는 첫 이미지) + 소제목(#~###) 단위 카드, 구간의 첫 이미지를 배경으로
export function postToCardText(title: string, description: string, md: string, cover?: string): string {
  const cards = [`# ${title}\n${imageLine(cover ?? firstImage(md))}${description}`.trim()]
  // 코드 안 `# 주석` 줄에서 구간이 나뉘지 않게 코드 블록을 잠시 자리표시자로 바꿔 둔다
  const blocks: string[] = []
  const masked = md.replace(/```[\s\S]*?```/g, (m) => `\u0000${blocks.push(m) - 1}\u0000`)
  const restore = (t: string) => t.replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[Number(i)])
  for (const section of masked.split(/^(?=#{1,3}\s)/m).map(restore)) {
    const [first, ...rest] = section.split('\n')
    const isHeading = /^#{1,3}\s/.test(first)
    const raw = isHeading ? rest.join('\n') : section
    const body = clip(stripMarkdown(raw))
    const heading = isHeading ? first.replace(/^#+\s*/, '') : ''
    if (heading || body) cards.push(`${heading ? `# ${heading}\n` : ''}${imageLine(firstImage(raw))}${body}${firstCode(raw)}`.trim())
  }
  return cards.join('\n---\n')
}
