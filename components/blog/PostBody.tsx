import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

export default function PostBody({ content }: { content: string }) {
  return (
    <div
      className="prose prose-lg dark:prose-invert"
      style={{
        maxWidth: 'none',
        color: 'var(--text)',
        lineHeight: 1.85,
        fontSize: '1rem',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]}
        components={{
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              style={{ borderRadius: '8px', maxWidth: '100%', margin: '1.5rem 0' }}
            />
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: '3px solid var(--accent)',
                paddingLeft: '1.25rem',
                margin: '1.5rem 0',
                color: 'var(--text-muted)',
                fontStyle: 'normal',
                background: 'var(--bg-secondary)',
                borderRadius: '0 8px 8px 0',
                padding: '1rem 1.25rem',
              }}
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
