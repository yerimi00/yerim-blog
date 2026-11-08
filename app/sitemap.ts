import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getAllPosts, getAllSeries } from '@/lib/notion'
import { getAllProjects } from '@/lib/projects'
import { getPublishedQuestions } from '@/lib/interview'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, series, projects, questions] = await Promise.all([
    getAllPosts(),
    getAllSeries(),
    getAllProjects(),
    getPublishedQuestions(),
  ])

  const staticPaths = ['', '/blog', '/blog/series', '/interview', '/work', '/about/fe', '/about/be', '/about/pm', '/guestbook', '/notices']

  return [
    ...staticPaths.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.date })),
    ...series
      .filter((name) => name !== 'interactions')
      .map((name) => ({ url: `${SITE_URL}/blog/series/${encodeURIComponent(name)}` })),
    ...questions.map((q) => ({ url: `${SITE_URL}/interview/${q.slug}`, lastModified: q.publishedAt || undefined })),
    ...projects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}` })),
  ]
}
