import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

export default function PostBody({ content }: { content: string }) {
  return (
    <div style={{ maxWidth: 'none', color: 'var(--text)', lineHeight: 1.85, fontSize: '1rem' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]}
        components={{
          h2: ({ children, id }) => (
            <h2
              id={id}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                lineHeight: 1.5,
                color: 'var(--text)',
                margin: '3rem 0 1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3
              id={id}
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                lineHeight: 1.5,
                color: 'var(--text)',
                margin: '2rem 0 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '3px',
                  height: '1em',
                  background: 'var(--accent)',
                  borderRadius: '2px',
                  flexShrink: 0,
                }}
              />
              {children}
            </h3>
          ),
          h4: ({ children, id }) => (
            <h4
              id={id}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text)',
                margin: '1.5rem 0 0.5rem',
                lineHeight: 1.5,
              }}
            >
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p style={{ margin: '0 0 1.1rem', color: 'var(--text)', lineHeight: 1.85, fontSize: '1rem', fontWeight: 300 }}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: '0.5rem 0 1.1rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: '0.5rem 0 1.1rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.75 }}>
              {children}
            </li>
          ),
          hr: () => (
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              style={{ borderRadius: '8px', maxWidth: '100%', margin: '1.5rem 0', display: 'block' }}
            />
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700, color: 'inherit' }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ fontStyle: 'italic', color: 'inherit' }}>{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="prose-blockquote">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.85em',
                    background: 'var(--bg-secondary)',
                    color: 'var(--accent)',
                    padding: '0.15em 0.4em',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                  }}
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem',
                }}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              style={{
                textAlign: 'left',
                padding: '0.6rem 1rem',
                borderBottom: '2px solid var(--border)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                padding: '0.6rem 1rem',
                borderBottom: '1px solid var(--border)',
                color: 'var(--text)',
                verticalAlign: 'top',
              }}
            >
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
