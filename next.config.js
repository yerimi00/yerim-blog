/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 1800,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
    ],
  },
  // IA v2 이전 — 기존 링크 보호 (구체적인 규칙이 위)
  async redirects() {
    return [
      { source: '/series/interactions', destination: '/lab', permanent: true },
      { source: '/series/interactions/:slug', destination: '/lab/:slug', permanent: true },
      { source: '/series', destination: '/blog/series', permanent: true },
      { source: '/series/:name', destination: '/blog/series/:name', permanent: true },
      { source: '/project', destination: '/work', permanent: true },
      { source: '/project/:slug', destination: '/work/:slug', permanent: true },
      { source: '/ai-skills', destination: '/work#ai-skills', permanent: true },
    ]
  },
}

module.exports = nextConfig
