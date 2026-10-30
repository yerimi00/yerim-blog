// v3: 캐시 우선 → 네트워크 우선으로 바꾸면서 이전 캐시를 비운다
const CACHE_NAME = 'yerim-dev-v3'
const STATIC_ASSETS = ['/', '/blog', '/about']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  // Next.js 내부 번들, API, Notion 요청은 캐시 안 함
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('notion')
  ) return

  // 네트워크 우선: 항상 최신 페이지를 보여주고, 오프라인일 때만 캐시로 대체
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return res
      })
      .catch(() => caches.match(event.request).then((cached) => cached || Response.error()))
  )
})
