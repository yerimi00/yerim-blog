import { NextRequest, NextResponse } from 'next/server'
import { getGuestbookEntries, addGuestbookEntry } from '@/lib/guestbook'

export async function GET() {
  try {
    const entries = await getGuestbookEntries()
    return NextResponse.json(entries)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message: string = (body.message ?? '').trim()
    const name: string = (body.name ?? '').trim()
    const isPublic: boolean = body.isPublic !== false
    const password: string = (body.password ?? '').trim()

    if (!message || message.length < 1) {
      return NextResponse.json({ error: '메시지를 입력해주세요.' }, { status: 400 })
    }
    if (message.length > 500) {
      return NextResponse.json({ error: '메시지는 500자 이하로 입력해주세요.' }, { status: 400 })
    }
    if (!isPublic && !password) {
      return NextResponse.json({ error: '비공개 메시지에는 비밀번호를 설정해주세요.' }, { status: 400 })
    }

    await addGuestbookEntry(message, name, isPublic, password)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
  }
}
