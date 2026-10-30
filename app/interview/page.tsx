import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TodayQuestionCard from '@/components/interview/TodayQuestionCard'
import InterviewArchive from '@/components/interview/InterviewArchive'
import { getPublishedQuestions } from '@/lib/interview'

export const revalidate = 3600

export const metadata = {
  title: 'Interview',
  description: '매일 한 문제, 면접 단골 개발 질문. 먼저 생각해 보고 답을 확인해 보세요.',
  alternates: { canonical: '/interview' },
}

export default async function InterviewPage() {
  const questions = await getPublishedQuestions()
  const [today, ...rest] = questions

  return (
    <>
      <Header />
      <main style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="hand-title">
            Interview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            매일 한 문제, 면접 단골 개발 질문을 올려요. 먼저 생각해 보고 답을 확인해 보세요.
          </p>
        </div>

        {today ? (
          <>
            <section style={{ marginBottom: '3rem' }}>
              <TodayQuestionCard question={today} />
            </section>
            {rest.length > 0 && (
              <section>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                  지난 문제 <span style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--text-muted)' }}>{rest.length}개</span>
                </h2>
                <InterviewArchive questions={rest} />
              </section>
            )}
          </>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 0' }}>
            첫 문제를 준비하고 있어요. 조금만 기다려 주세요 🙏
          </p>
        )}
      </main>
      <Footer />
    </>
  )
}
