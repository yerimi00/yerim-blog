'use client'

import { useRef } from 'react'
import CopyButton from './CopyButton'

export default function CodeBlock({ lang, children }: { lang: string | null; children: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null)

  const getCode = () =>
    preRef.current?.querySelector('code')?.textContent?.replace(/\n$/, '') ?? ''

  return (
    <div style={{ position: 'relative', margin: '1rem 0' }}>
      {lang && (
        <span
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '4.5rem',
            fontSize: '0.72rem',
            color: '#6b7280',
            fontFamily: 'JetBrains Mono, monospace',
            userSelect: 'none',
            zIndex: 1,
          }}
        >
          {lang}
        </span>
      )}
      <CopyButton getCode={getCode} />
      <pre ref={preRef} style={{ margin: 0 }}>
        {children}
      </pre>
    </div>
  )
}
