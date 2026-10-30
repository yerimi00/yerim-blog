import { cache } from 'react'
import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { fetchWithRetry, NOTION_TIMEOUT_MS } from './notion-fetch'

const notion = new Client({ auth: process.env.NOTION_TOKEN, fetch: fetchWithRetry, timeoutMs: NOTION_TIMEOUT_MS })

export type InterviewQuestion = {
  id: string
  number: number | null
  question: string
  slug: string
  category: string
  level: string
  summary: string
  followUp: string
  publishedAt: string
  referenceUrl: string
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
    followUp: plain(p['꼬리질문']),
    publishedAt: plain(p['발행일']),
    referenceUrl: plain(p['참고 링크']),
  }
}

// 상태가 '발행'인 문제만, 발행일 최신순. DB 미설정·권한 없음이면 빈 배열
export const getPublishedQuestions = cache(async (): Promise<InterviewQuestion[]> => {
  const dbId = process.env.NOTION_INTERVIEW_DATABASE_ID
  if (!dbId) return []
  try {
    const response = await notion.databases.query({
      database_id: dbId,
      filter: { property: '상태', status: { equals: '발행' } },
      sorts: [{ property: '발행일', direction: 'descending' }],
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
