import { NextRequest, NextResponse } from 'next/server'
import { getGuestbookEntryPassword } from '@/lib/guestbook'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { password } = await req.json()
    if (!password?.trim()) {
      return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const adminPin = process.env.ADMIN_PIN
    // 관리자 PIN이면 바로 통과
    if (adminPin && password === adminPin) {
      return NextResponse.json({ ok: true })
    }

    // 항목 비밀번호 확인
    const entryPassword = await getGuestbookEntryPassword(params.id)
    if (entryPassword && password === entryPassword) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: '비밀번호가 올바르지 않아요.' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: '검증에 실패했습니다.' }, { status: 500 })
  }
}
