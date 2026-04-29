import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { pin } = await req.json()
  const adminPin = process.env.ADMIN_PIN

  if (!adminPin) {
    return NextResponse.json({ error: 'ADMIN_PIN이 설정되지 않았습니다.' }, { status: 500 })
  }
  if (!pin || pin !== adminPin) {
    return NextResponse.json({ error: '핀 번호가 올바르지 않습니다.' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
