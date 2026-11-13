import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'
import CardNewsMaker from '@/components/lab/CardNewsMaker'
import { getAllPosts, getPostBySlug, getPostContent } from '@/lib/notion'
import { postToCardText } from '@/lib/card-news'

export const metadata = {
  title: '카드뉴스 만들기 — Lab',
  description: '블로그 글이나 뉴스 기사를 인스타그램 카드뉴스(PNG)로 바꿔요',
  alternates: { canonical: '/lab/card-news' },
}

export default async function CardNewsPage({ searchParams }: { searchParams: { post?: string } }) {
  const posts = await getAllPosts()
  const post = searchParams.post ? await getPostBySlug(searchParams.post) : null
  const initialText = post ? postToCardText(post.title, post.description, await getPostContent(post.id), post.coverImage) : ''

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link
        href="/lab"
        style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginBottom: '2rem' }}
      >
        <IoIosArrowBack /> Lab
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">카드뉴스 만들기</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          블로그 글을 고르거나 뉴스 기사를 붙여넣으면 1080×1350 카드로 나눠 줘요. 나뉜 내용은 아래에서 고칠 수 있어요.
        </p>
      </div>

      {/* JS 없이 동작하는 GET 폼: ?post=slug로 서버가 글을 불러온다 */}
      <form action="/lab/card-news" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <select
          name="post"
          defaultValue={post?.slug ?? ''}
          aria-label="블로그 글 선택"
          style={{ flex: '1 1 240px', minWidth: 0, padding: '0.5rem 0.75rem', fontSize: '0.9rem', color: 'var(--text)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
        >
          <option value="">블로그 글에서 만들기…</option>
          {posts.map((p) => (
            <option key={p.slug} value={p.slug}>{p.title}</option>
          ))}
        </select>
        <button
          type="submit"
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: 'var(--on-primary)', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
        >
          불러오기
        </button>
      </form>

      <CardNewsMaker key={post?.slug ?? 'blank'} initialText={initialText} />
    </main>
  )
}
