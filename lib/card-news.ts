// 카드뉴스 텍스트 형식: 카드는 `---` 줄로 나누고, `#`로 시작하는 줄은 카드 제목, 나머지는 본문.
// `---`가 없으면 빈 줄(문단) 단위로 나눈다 — 뉴스 본문을 그대로 붙여넣는 경우
export type Card = { title: string; body: string }

const BODY_LIMIT = 180

export function parseCards(text: string): Card[] {
  const src = text.replace(/\r\n/g, '\n').trim()
  if (!src) return []
  const chunks = /^-{3,}\s*$/m.test(src) ? src.split(/^-{3,}\s*$/m) : src.split(/\n\s*\n/)
  return chunks
    .map((chunk) => {
      const lines = chunk.trim().split('\n')
      const title = lines.filter((l) => l.startsWith('#')).map((l) => l.replace(/^#+\s*/, '')).join(' ')
      const body = lines.filter((l) => !l.startsWith('#')).join('\n').trim()
      return { title, body }
    })
    .filter((c) => c.title || c.body)
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

// 블로그 글 → 카드뉴스 텍스트. 표지(제목·설명) + 소제목(#~###) 단위 카드
export function postToCardText(title: string, description: string, md: string): string {
  const cards = [`# ${title}\n${description}`.trim()]
  for (const section of md.split(/^(?=#{1,3}\s)/m)) {
    const [first, ...rest] = section.split('\n')
    const isHeading = /^#{1,3}\s/.test(first)
    const body = clip(stripMarkdown(isHeading ? rest.join('\n') : section))
    const heading = isHeading ? first.replace(/^#+\s*/, '') : ''
    if (heading || body) cards.push(heading ? `# ${heading}\n${body}`.trim() : body)
  }
  return cards.join('\n---\n')
}
