import { NextRequest, NextResponse } from 'next/server'
import { getGuestbookEntryPassword, updateGuestbookEntryPassword } from '@/lib/guestbook'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword?.trim()) {
      return NextResponse.json({ error: '현재 비밀번호를 입력해주세요.' }, { status: 400 })
    }
    if (!newPassword?.trim()) {
      return NextResponse.json({ error: '새 비밀번호를 입력해주세요.' }, { status: 400 })
    }

    // 현재 비밀번호 검증: 항목 비밀번호 또는 관리자 PIN
    const adminPin = process.env.ADMIN_PIN
    const isAdminPin = adminPin && currentPassword === adminPin
    if (!isAdminPin) {
      const entryPassword = await getGuestbookEntryPassword(params.id)
      if (!entryPassword || currentPassword !== entryPassword) {
        return NextResponse.json({ error: '현재 비밀번호가 올바르지 않아요.' }, { status: 401 })
      }
    }

    await updateGuestbookEntryPassword(params.id, newPassword.trim())
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: '비밀번호 변경에 실패했습니다.' }, { status: 500 })
  }
}
