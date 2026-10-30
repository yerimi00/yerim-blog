import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import PostBody from '@/components/blog/PostBody'
import GiscusComments from '@/components/blog/GiscusComments'
import GoogleAdsense from '@/components/GoogleAdsense'
import AnswerReveal from '@/components/interview/AnswerReveal'
import { getPublishedQuestions, getQuestionBySlug, getQuestionContent } from '@/lib/interview'
import { formatDate } from '@/lib/utils'

export const revalidate = 3600

// 본문을 Notion에서 받아오는 페이지라 빌드 때 미리 만들지 않는다 (요청이 몰리면 Vercel 빌드가 타임아웃으로 실패).
// 첫 방문 때 만들어 캐시하고 revalidate 주기로 갱신(ISR)
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const q = await getQuestionBySlug(params.slug)
  if (!q) return {}
  return {
    title: q.question,
    description: q.summary || q.question,
    alternates: { canonical: `/interview/${q.slug}` },
    openGraph: { title: q.question, description: q.summary || q.question, type: 'article', publishedTime: q.publishedAt },
  }
}

export default async function InterviewDetailPage({ params }: { params: { slug: string } }) {
  const q = await getQuestionBySlug(params.slug)
  if (!q) notFound()

  const [content, all] = await Promise.all([getQuestionContent(q.id), getPublishedQuestions()])
  const idx = all.findIndex((item) => item.slug === q.slug)
  const prev = all[idx + 1] ?? null
  const next = idx > 0 ? all[idx - 1] : null

  return (
    <>
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <Link
          href="/interview"
          style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginBottom: '1.5rem' }}
        >
          <IoIosArrowBack /> Interview
        </Link>

        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
            {q.number !== null && (
              <span style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}>Q{q.number}</span>
            )}
            {q.category && <span className="tag-badge">{q.category}</span>}
            {q.level && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>난이도 {q.level}</span>}
            {q.publishedAt && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(q.publishedAt)}</span>}
          </div>
          <h1 className="post-title" style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '2rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text)', margin: 0 }}>
            {q.question}
          </h1>
        </header>

        {/* 꼬리질문·참고 자료는 Notion 본문에 들어 있다 */}
        <AnswerReveal>
          <PostBody content={content} />
        </AnswerReveal>

        <GoogleAdsense slot={process.env.NEXT_PUBLIC_ADSENSE_POST_SLOT ?? ''} style={{ margin: '2rem 0' }} />

        {(prev || next) && (
          <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <div>
              {prev && (
                <Link href={`/interview/${prev.slug}`} style={{ textDecoration: 'none' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>이전 문제</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>{prev.question}</p>
                </Link>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              {next && (
                <Link href={`/interview/${next.slug}`} style={{ textDecoration: 'none' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>다음 문제</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>{next.question}</p>
                </Link>
              )}
            </div>
          </nav>
        )}

        <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text)' }}>내 답변 공유하기</h2>
          <GiscusComments />
        </section>
      </main>
    </>
  )
}
