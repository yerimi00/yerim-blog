import { NextResponse } from 'next/server'
import { getPostBySlug, incrementViews } from '@/lib/notion'

export async function POST(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug)
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await incrementViews(post.id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
