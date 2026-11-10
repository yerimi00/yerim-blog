import type { Post } from '@/types'

import { SITE_URL, SITE_NAME, SITE_DOMAIN_NAME, SITE_DESCRIPTION, AUTHOR_NAME } from '@/lib/site'

const AUTHOR = AUTHOR_NAME

// 홈 전용: 검색 결과의 사이트 이름과 '예림 개발 블로그' 같은 브랜드 검색어를 연결한다
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: [SITE_DOMAIN_NAME, `${AUTHOR_NAME} 개발 블로그`, 'yerimi00'],
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'ko-KR',
    author: { '@type': 'Person', name: AUTHOR_NAME, url: `${SITE_URL}/about/fe`, sameAs: ['https://github.com/yerimi00'] },
  }
}

export function buildBlogPostingSchema(post: Post, postUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.coverImage ?? `${SITE_URL}/logo.png`,
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
        url: `${SITE_URL}/logo.png`,
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
