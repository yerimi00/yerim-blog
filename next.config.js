/** @type {import('next').NextConfig} */
const nextConfig = {
  // 빌드 시 정적 페이지를 동시에 만들면 Notion API 요청 한도(429)에 걸려 긴 글이 타임아웃난다 → 워커 1개로 순차 생성
  experimental: { cpus: 1 },
  images: {
    minimumCacheTTL: 1800,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
      // 글 본문 이미지 일부가 velog CDN에 있다 — 카드뉴스가 /_next/image로 받아 캔버스에 그린다
      { protocol: 'https', hostname: 'velog.velcdn.com' },
    ],
  },
  // IA v2 이전 — 기존 링크 보호 (구체적인 규칙이 위)
  async redirects() {
    return [
      // 예전 Lab 인터랙션 상세 주소는 목록으로 보낸다 (인터랙션 데모는 삭제됨). 도구(card-news)는 제외.
      // 나중에 /lab/새도구 를 열 수 있게 임시(307)로 둔다
      { source: '/lab/:slug((?!card-news$).*)', destination: '/lab', permanent: false },
      { source: '/series/interactions', destination: '/lab', permanent: true },
      { source: '/series/interactions/:slug', destination: '/lab', permanent: true },
      { source: '/series', destination: '/blog/series', permanent: true },
      { source: '/series/:name', destination: '/blog/series/:name', permanent: true },
      { source: '/project', destination: '/work', permanent: true },
      { source: '/project/:slug', destination: '/work/:slug', permanent: true },
      { source: '/ai-skills', destination: '/work#ai-skills', permanent: true },
    ]
  },
}

module.exports = nextConfig
