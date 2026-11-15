import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import MemeFinder from '@/components/lab/MemeFinder'
import { getMemes } from '@/lib/memes'
import { EMOTION_TAGS } from '@/lib/meme-match'

// Notion 업로드 이미지 주소가 1시간 뒤 만료되므로 그보다 자주 다시 만든다
export const revalidate = 1800

export const metadata = {
  title: '짤 추천 — Lab',
  description: '지금 상황이나 감정을 적으면 어울리는 짤을 골라 줘요',
  alternates: { canonical: '/lab/meme' },
}

export default async function MemePage() {
  const memes = await getMemes()
  // 기본 감정 태그 + 내 짤에만 있는 태그
  const tags = Array.from(new Set([...EMOTION_TAGS, ...memes.flatMap((m) => m.tags)]))

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link
        href="/lab"
        style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginBottom: '2rem' }}
      >
        <IoIosArrowBack /> Lab
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">짤 추천</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          지금 상황을 적거나 감정을 고르면 어울리는 짤을 골라 줘요. 복사해서 바로 붙여넣거나 저장할 수 있어요.
        </p>
      </div>

      <MemeFinder memes={memes} tags={tags} />
    </main>
  )
}
