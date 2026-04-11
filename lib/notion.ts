import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { Post } from '@/types'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

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

// 태그 목록 추출
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)))
  return Array.from(tagSet)
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
