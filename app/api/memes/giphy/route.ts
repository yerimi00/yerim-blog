import { NextResponse } from 'next/server'
import { searchGiphy } from '@/lib/memes'

// 짤 추천 랩의 GIPHY 검색. API 키는 서버에만 둔다. enabled=false면 키가 없거나 GIPHY가 실패한 것
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const q = (params.get('q') ?? '').slice(0, 100)
  const offset = Math.min(Math.max(Number(params.get('offset')) || 0, 0), 4000)
  const limit = Math.min(Math.max(Number(params.get('limit')) || 12, 1), 24)
  const items = await searchGiphy(q, offset, limit)
  return NextResponse.json({ enabled: items !== null, items: items ?? [] })
}
