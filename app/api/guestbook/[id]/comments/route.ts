import { NextRequest, NextResponse } from 'next/server'
import { getComments, addComment, getGuestbookEntries } from '@/lib/guestbook'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const comments = await getComments(params.id)
    return NextResponse.json(comments)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const message: string = (body.message ?? '').trim()
    const name: string = (body.name ?? '').trim()
    const pin: string = (body.pin ?? '').trim()

    if (!message || message.length < 1) {
      return NextResponse.json({ error: '댓글을 입력해주세요.' }, { status: 400 })
    }
    if (message.length > 300) {
      return NextResponse.json({ error: '댓글은 300자 이하로 입력해주세요.' }, { status: 400 })
    }

    // 비공개 항목인지 확인 후 PIN 검증
    const entries = await getGuestbookEntries()
    const entry = entries.find((e) => e.id === params.id)
    if (entry?.isPublic === false) {
      const adminPin = process.env.ADMIN_PIN
      if (!adminPin || pin !== adminPin) {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 })
      }
    }

    await addComment(params.id, name, message)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
  }
}
