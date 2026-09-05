'use client'

import CopyButton from '@/components/blog/CopyButton'

export default function AiSkillCommandBox({ command }: { command: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <pre style={{ margin: 0, padding: '0.6rem 3.2rem 0.6rem 0.75rem', fontSize: '0.78rem', overflowX: 'auto' }}>
        <code>{command}</code>
      </pre>
      <CopyButton getCode={() => command} />
    </div>
  )
}
