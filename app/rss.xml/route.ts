import { getAllPosts } from '@/lib/notion'
import { NextResponse } from 'next/server'

export const revalidate = 86400

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yerim.dev'
const SITE_NAME = 'yerim.dev'
const SITE_DESCRIPTION = '피할 수 없다면 즐..즐입니다 ~ KIN'

export async function GET() {
  const posts = await getAllPosts()

  const items = posts
    .map((post) => {
      const categories = post.tags
        .map((tag) => `      <category><![CDATA[${tag}]]></category>`)
        .join('\n')
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
${categories}
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  })
}
