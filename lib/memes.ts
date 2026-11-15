// 짤 추천 랩 데이터: Notion "짤 모음" DB(내 짤) + GIPHY 검색(외부 GIF)
import { cache } from 'react'
import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { fetchWithRetry, NOTION_TIMEOUT_MS } from './notion-fetch'

const notion = new Client({ auth: process.env.NOTION_TOKEN, fetch: fetchWithRetry, timeoutMs: NOTION_TIMEOUT_MS })

export type Meme = {
  id: string
  title: string
  src: string
  tags: string[]
  keywords: string[]
  source: 'mine' | 'giphy'
}

function toMeme(page: PageObjectResponse): Meme | null {
  const p = page.properties
  const files = p['이미지']?.type === 'files' ? p['이미지'].files : []
  const file = files[0]
  const src = !file ? '' : 'file' in file ? file.file.url : file.external.url
  if (!src) return null
  const title = p['제목']?.type === 'title' ? p['제목'].title.map((t) => t.plain_text).join('') : ''
  const tags = p['태그']?.type === 'multi_select' ? p['태그'].multi_select.map((t) => t.name) : []
  const keywordText = p['키워드']?.type === 'rich_text' ? p['키워드'].rich_text.map((t) => t.plain_text).join('') : ''
  const keywords = keywordText.split(',').map((k) => k.trim()).filter(Boolean)
  return { id: page.id, title, src, tags, keywords, source: 'mine' }
}

// 공개 체크한 짤만. DB 미설정·권한 없음이면 빈 배열 (GIPHY 결과만 보인다)
// Notion 업로드 파일 주소는 1시간 뒤 만료되므로 이 값을 쓰는 페이지는 그보다 짧게 다시 만든다
export const getMemes = cache(async (): Promise<Meme[]> => {
  const dbId = process.env.NOTION_MEME_DATABASE_ID
  if (!dbId) return []
  try {
    const memes: Meme[] = []
    let cursor: string | undefined
    do {
      const res = await notion.databases.query({
        database_id: dbId,
        filter: { property: '공개', checkbox: { equals: true } },
        start_cursor: cursor,
        page_size: 100,
      })
      for (const page of res.results) {
        if (page.object !== 'page' || !('properties' in page)) continue
        const meme = toMeme(page as PageObjectResponse)
        if (meme) memes.push(meme)
      }
      cursor = res.has_more ? res.next_cursor ?? undefined : undefined
    } while (cursor)
    return memes
  } catch (error) {
    console.warn('[getMemes] 짤 DB 조회 실패:', error)
    return []
  }
})

type GiphyGif = { id: string; title: string; images: { downsized?: { url: string }; original: { url: string } } }

// GIPHY 검색. 키가 없거나 실패하면 null (화면에서 GIPHY 칸을 숨긴다)
export async function searchGiphy(q: string, offset: number, limit: number): Promise<Meme[] | null> {
  const key = process.env.GIPHY_API_KEY
  if (!key || !q) return null
  const url = new URL('https://api.giphy.com/v1/gifs/search')
  url.search = new URLSearchParams({ api_key: key, q, limit: String(limit), offset: String(offset), rating: 'pg', lang: 'ko' }).toString()
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`GIPHY ${res.status}`)
    const { data } = (await res.json()) as { data: GiphyGif[] }
    return data.map((g) => ({
      id: `giphy-${g.id}`,
      title: g.title,
      src: g.images.downsized?.url ?? g.images.original.url,
      tags: [],
      keywords: [],
      source: 'giphy' as const,
    }))
  } catch (error) {
    console.warn('[searchGiphy] 실패:', error)
    return null
  }
}
