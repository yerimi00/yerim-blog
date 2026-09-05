import type { AiSkillCategory } from '@/app/data/ai-skills'
import AiSkillCard from '@/components/ai-skills/AiSkillCard'

export default function AiSkillSection({ category }: { category: AiSkillCategory }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
        {category.title}
      </h2>
      <div
        className="ai-skill-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}
      >
        {category.skills.map((skill) => (
          <AiSkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </section>
  )
}
