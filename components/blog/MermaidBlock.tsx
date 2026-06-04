'use client'

import { useEffect, useId, useRef } from 'react'

export default function MermaidBlock({ code }: { code: string }) {
  const uid = useId().replace(/:/g, '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    const render = async () => {
      const { default: mermaid } = await import('mermaid')
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' })
      if (cancelled || !ref.current) return
      try {
        const { svg } = await mermaid.render(`mermaid-${uid}`, code)
        if (!cancelled && ref.current) ref.current.innerHTML = svg
      } catch {
        if (ref.current) ref.current.textContent = code
      }
    }
    render()
    return () => { cancelled = true }
  }, [code, uid])

  return (
    <div
      ref={ref}
      style={{
        margin: '1.5rem 0',
        overflowX: 'auto',
        padding: '1.25rem',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        minHeight: '60px',
      }}
    />
  )
}
