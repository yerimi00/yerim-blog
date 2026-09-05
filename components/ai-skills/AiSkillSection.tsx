import type { AiSkillCategory } from '@/app/data/ai-skills'

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
          <div key={skill.name} className="sidebar-card card-hover">
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.4rem' }}>
              {skill.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              {skill.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
