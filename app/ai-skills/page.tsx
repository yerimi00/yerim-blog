import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AiSkillSection from '@/components/ai-skills/AiSkillSection'
import { aiSkillCategories } from '@/app/data/ai-skills'

export const metadata = {
  title: 'AI Skills',
  description: '실무 개발 작업에 실제로 쓰고 있는 Claude Code 스킬 모음',
}

export default function AiSkillsPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ margin: '2rem 0 3rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
            AI Skills
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '640px' }}>
            개발 작업에 Claude Code를 활용하면서 실제로 쓰고 있는 스킬과 자동화입니다. 커스텀으로 만든
            것도 있고, 기본 제공되는 것을 그대로 쓰는 것도 있습니다.
          </p>
        </div>

        {aiSkillCategories.map((category) => (
          <AiSkillSection key={category.title} category={category} />
        ))}
      </main>
      <Footer />
    </>
  )
}
