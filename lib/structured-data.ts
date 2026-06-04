import type { Post } from '@/types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yerim.dev'
const SITE_NAME = 'yerim.dev'
const AUTHOR = 'yerim'

export function buildBlogPostingSchema(post: Post, postUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage ?? `${SITE_URL}/logo.jpg`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: AUTHOR,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.tags.join(', '),
  }
}

export function buildBreadcrumbSchema(post: Post, postUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }
}
