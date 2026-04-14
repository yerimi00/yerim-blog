import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { Post } from '@/types'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

// ---- Callout / Column 커스텀 변환 ----

function richTextToHtml(richText: any[]): string {
  if (!richText?.length) return ''
  return richText
    .map((t: any) => {
      let text = t.plain_text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>')
      const a = t.annotations || {}
      if (a.code) text = `<code>${text}</code>`
      if (a.bold) text = `<strong>${text}</strong>`
      if (a.italic) text = `<em>${text}</em>`
      if (a.strikethrough) text = `<del>${text}</del>`
      if (a.underline) text = `<u style="text-decoration:underline">${text}</u>`
      if (t.href?.startsWith('http')) {
        const safeHref = t.href.replace(/"/g, '%22')
        text = `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${text}</a>`
      }
      return text
    })
    .join('')
}

const CALLOUT_BG: Record<string, string> = {
  blue_background:   'callout-blue',
  yellow_background: 'callout-yellow',
  red_background:    'callout-red',
  green_background:  'callout-green',
  purple_background: 'callout-purple',
  gray_background:   'callout-gray',
  orange_background: 'callout-orange',
  pink_background:   'callout-pink',
  default:           'callout-default',
}

async function calloutBlockToHtml(block: any): Promise<string> {
  const c = block.callout
  if (!c) return ''
  const icon = c.icon
  const emoji = icon?.type === 'emoji' ? icon.emoji : '💡'
  const colorClass = CALLOUT_BG[c.color || 'default'] || 'callout-default'
  const firstLine = richTextToHtml(c.rich_text)
  // 콜아웃 안에 여러 줄이 있으면 children 블록으로 관리됨
  const childrenHtml = block.has_children ? await columnBlocksToHtml(block.id) : ''

  const titleHtml = firstLine ? `<p class="callout-title">${firstLine}</p>` : ''
  const body = `${titleHtml}${childrenHtml}`
  return `<div class="callout ${colorClass}"><span class="callout-icon">${emoji}</span><div class="callout-body not-prose">${body}</div></div>`
}

async function columnBlocksToHtml(blockId: string): Promise<string> {
  const { results } = await notion.blocks.children.list({ block_id: blockId })
  const parts: string[] = []
  let listType: 'ul' | 'ol' | null = null

  for (const b of results as any[]) {
    const type = b.type
    const c = b[type]

    if (type !== 'bulleted_list_item' && listType === 'ul') { parts.push('</ul>'); listType = null }
    if (type !== 'numbered_list_item' && listType === 'ol') { parts.push('</ol>'); listType = null }

    switch (type) {
      case 'paragraph':
        parts.push(c.rich_text.length ? `<p>${richTextToHtml(c.rich_text)}</p>` : '<br/>')
        break
      case 'heading_1': parts.push(`<h1>${richTextToHtml(c.rich_text)}</h1>`); break
      case 'heading_2': parts.push(`<h2>${richTextToHtml(c.rich_text)}</h2>`); break
      case 'heading_3': parts.push(`<h3>${richTextToHtml(c.rich_text)}</h3>`); break
      case 'heading_4': parts.push(`<h4>${richTextToHtml(c.rich_text)}</h4>`); break
      case 'heading_5': parts.push(`<h5>${richTextToHtml(c.rich_text)}</h5>`); break
      case 'heading_6': parts.push(`<h6>${richTextToHtml(c.rich_text)}</h6>`); break
      case 'callout':   parts.push(await calloutBlockToHtml(b)); break
      case 'bulleted_list_item':
        if (listType !== 'ul') { parts.push('<ul>'); listType = 'ul' }
        parts.push(`<li>${richTextToHtml(c.rich_text)}</li>`)
        break
      case 'numbered_list_item':
        if (listType !== 'ol') { parts.push('<ol>'); listType = 'ol' }
        parts.push(`<li>${richTextToHtml(c.rich_text)}</li>`)
        break
      case 'image': {
        const url = c.type === 'external' ? c.external?.url : c.file?.url
        parts.push(`<img src="${url}" alt="" style="border-radius:8px;max-width:100%;margin:0.5rem 0;" />`)
        break
      }
      case 'divider': parts.push('<hr />'); break
      case 'quote':
        parts.push(`<blockquote>${richTextToHtml(c.rich_text)}</blockquote>`)
        break
    }
  }

  if (listType === 'ul') parts.push('</ul>')
  if (listType === 'ol') parts.push('</ol>')
  return parts.join('')
}

n2m.setCustomTransformer('callout', async (block: any) => {
  return calloutBlockToHtml(block)
})

n2m.setCustomTransformer('column_list', async (block: any) => {
  if (!block?.id) return ''
  try {
    const { results: columns } = await notion.blocks.children.list({ block_id: block.id })
    const colHtmls = await Promise.all(
      columns.map(async (col: any) => {
        try {
          const content = await columnBlocksToHtml(col.id)
          return `<div class="notion-column">${content}</div>`
        } catch {
          return '<div class="notion-column"></div>'
        }
      })
    )
    return `<div class="notion-columns">${colHtmls.join('')}</div>`
  } catch {
    return ''
  }
})

// column 블록 자체는 column_list에서 처리하므로 개별 출력 방지
n2m.setCustomTransformer('column', async () => '')

// ---- End custom transformers ----

const DATABASE_ID = process.env.NOTION_DATABASE_ID!

// Notion DB에서 모든 게시글 가져오기
export async function getAllPosts(): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Date', direction: 'descending' }],
  })

  return response.results.map((page: any) => extractPostMeta(page))
}

// 슬러그로 단일 게시글 메타 가져오기
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  })

  if (!response.results.length) return null
  return extractPostMeta(response.results[0] as any)
}

// 게시글 본문 Markdown으로 변환
export async function getPostContent(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId)
  const mdString = n2m.toMarkdownString(mdBlocks)
  return mdString.parent
}

// 시리즈별로 게시글 묶기
export async function getPostsBySeries() {
  const posts = await getAllPosts()
  const seriesMap: Record<string, Post[]> = {}

  posts.forEach((post) => {
    if (post.series) {
      if (!seriesMap[post.series]) seriesMap[post.series] = []
      seriesMap[post.series].push(post)
    }
  })

  return seriesMap
}

// 인기글 (views 기준 상위 5개, 조회수 없으면 최신순 fallback)
export async function getPopularPosts(): Promise<Post[]> {
  const posts = await getAllPosts()
  const withViews = posts
    .filter((p) => p.views !== undefined)
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
  if (withViews.length >= 2) return withViews.slice(0, 5)
  return posts.slice(0, 5)
}

// 조회수 증가
export async function incrementViews(pageId: string): Promise<void> {
  const page = await notion.pages.retrieve({ page_id: pageId }) as any
  const current = page.properties?.Views?.number ?? 0
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Views: { number: current + 1 },
    },
  })
}

// 태그 목록 추출
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)))
  return Array.from(tagSet)
}

// 시리즈 목록 추출
export async function getAllSeries(): Promise<string[]> {
  const posts = await getAllPosts()
  const seen = new Set<string>()
  const series: string[] = []
  posts.forEach((post) => {
    if (post.series && !seen.has(post.series)) {
      seen.add(post.series)
      series.push(post.series)
    }
  })
  return series
}

// 페이지 메타데이터 파싱 헬퍼
function extractPostMeta(page: any): Post {
  const props = page.properties

  const title =
    props.Title?.title?.[0]?.plain_text ||
    props.Name?.title?.[0]?.plain_text ||
    'Untitled'

  const slug =
    props.Slug?.rich_text?.[0]?.plain_text || page.id

  const description =
    props.Description?.rich_text?.[0]?.plain_text || ''

  const date =
    props.Date?.date?.start || page.created_time

  const tags =
    props.Tags?.multi_select?.map((t: any) => t.name) || []

  const series =
    props.Series?.rich_text?.[0]?.plain_text || undefined


  const views =
    props.Views?.number ?? undefined

  const coverImage =
    page.cover?.external?.url || page.cover?.file?.url || undefined

  const published =
    props.Published?.checkbox ?? false

  return { id: page.id, title, slug, description, date, tags, series, coverImage, views, published }
}
