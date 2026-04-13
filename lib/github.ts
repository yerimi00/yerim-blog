// GitHub GraphQL API로 Giscus 댓글 수 / 최신 댓글 가져오기
// Giscus는 pathname 매핑을 사용 — 각 글의 discussion 제목은 해당 글의 URL 경로 (e.g. blog/my-post)

export interface RecentComment {
  author: string
  body: string
  createdAt: string
  postSlug: string
  url: string
}

function githubRequest(token: string, query: string, variables: object) {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  })
}

export async function getRecentComments(): Promise<RecentComment[]> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  if (!token || !repo || !categoryId) return []

  const [owner, name] = repo.split('/')
  if (!owner || !name) return []

  const query = `
    query($owner: String!, $name: String!, $categoryId: ID!) {
      repository(owner: $owner, name: $name) {
        discussions(first: 20, categoryId: $categoryId, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            title
            url
            comments(last: 1) {
              nodes {
                author { login }
                body
                createdAt
                url
              }
            }
          }
        }
      }
    }
  `

  try {
    const res = await githubRequest(token, query, { owner, name, categoryId })
    const json = await res.json()
    const discussions: { title: string; url: string; comments: { nodes: { author: { login: string }; body: string; createdAt: string; url: string }[] } }[] =
      json?.data?.repository?.discussions?.nodes ?? []

    const comments: RecentComment[] = []
    for (const d of discussions) {
      const c = d.comments.nodes[0]
      if (!c) continue
      const slug = d.title.replace(/^\/?blog\//, '')
      comments.push({
        author: c.author?.login ?? 'anonymous',
        body: c.body.slice(0, 60) + (c.body.length > 60 ? '…' : ''),
        createdAt: c.createdAt,
        postSlug: slug,
        url: c.url,
      })
    }
    return comments.slice(0, 5)
  } catch {
    return []
  }
}

export async function getCommentCounts(slugs: string[]): Promise<Record<string, number>> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  if (!token || !repo || !categoryId) return {}

  const [owner, name] = repo.split('/')
  if (!owner || !name) return {}

  const query = `
    query($owner: String!, $name: String!, $categoryId: ID!) {
      repository(owner: $owner, name: $name) {
        discussions(first: 100, categoryId: $categoryId) {
          nodes {
            title
            comments { totalCount }
          }
        }
      }
    }
  `

  try {
    const res = await githubRequest(token, query, { owner, name, categoryId })

    const json = await res.json()
    const discussions: { title: string; comments: { totalCount: number } }[] =
      json?.data?.repository?.discussions?.nodes ?? []

    const counts: Record<string, number> = {}
    for (const slug of slugs) {
      const match = discussions.find(
        (d) => d.title === `blog/${slug}` || d.title === `/blog/${slug}`
      )
      counts[slug] = match?.comments.totalCount ?? 0
    }
    return counts
  } catch {
    return {}
  }
}
