import { cache } from 'react'
import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { fetchWithRetry, NOTION_TIMEOUT_MS } from './notion-fetch'
import { getPostContent } from './notion'
import { extractWidget, type Widget } from './interview-widgets'

const notion = new Client({ auth: process.env.NOTION_TOKEN, fetch: fetchWithRetry, timeoutMs: NOTION_TIMEOUT_MS })

export type InterviewQuestion = {
  id: string
  number: number | null
  question: string
  slug: string
  category: string
  level: string
  summary: string
  publishedAt: string
}

function plain(prop: PageObjectResponse['properties'][string] | undefined): string {
  if (!prop) return ''
  if (prop.type === 'title') return prop.title.map((t) => t.plain_text).join('')
  if (prop.type === 'rich_text') return prop.rich_text.map((t) => t.plain_text).join('')
  if (prop.type === 'select') return prop.select?.name ?? ''
  if (prop.type === 'url') return prop.url ?? ''
  if (prop.type === 'date') return prop.date?.start ?? ''
  return ''
}

function extractQuestion(page: PageObjectResponse): InterviewQuestion {
  const p = page.properties
  const numberProp = p['번호']
  return {
    id: page.id,
    number: numberProp?.type === 'unique_id' ? numberProp.unique_id.number : null,
    question: plain(p['질문']),
    slug: plain(p.Slug),
    category: plain(p['카테고리']),
    level: plain(p['난이도']),
    summary: plain(p['한 줄 요약']),
    publishedAt: plain(p['발행일']),
  }
}

// 운영은 '발행'만. 로컬 개발에서는 발행 전 검수용으로 '검수중'도 보여준다
const VISIBLE_STATUSES = process.env.NODE_ENV === 'development' ? ['발행', '검수중'] : ['발행']

// 발행일 최신순(발행일 없는 검수중은 뒤로). DB 미설정·권한 없음이면 빈 배열
export const getPublishedQuestions = cache(async (): Promise<InterviewQuestion[]> => {
  const dbId = process.env.NOTION_INTERVIEW_DATABASE_ID
  if (!dbId) return []
  try {
    const response = await notion.databases.query({
      database_id: dbId,
      filter: { or: VISIBLE_STATUSES.map((s) => ({ property: '상태', status: { equals: s } })) },
      sorts: [
        { property: '발행일', direction: 'descending' },
        { property: '번호', direction: 'descending' },
      ],
    })
    return response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(extractQuestion)
      .filter((q) => q.slug)
  } catch (error) {
    console.warn('[getPublishedQuestions] Interview DB 조회 실패:', error)
    return []
  }
})

export async function getQuestionBySlug(slug: string): Promise<InterviewQuestion | null> {
  const questions = await getPublishedQuestions()
  return questions.find((q) => q.slug === slug) ?? null
}

// 문제 본문(답변)과 위젯. "🎮 위젯 데이터" 토글은 본문에서 떼어 위젯으로 파싱한다 (검수 메모 콜아웃은 lib/notion에서 제외)
export async function getQuestionContent(pageId: string): Promise<{ content: string; widget: Widget | null }> {
  return extractWidget(await getPostContent(pageId))
}
