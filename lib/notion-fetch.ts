// Notion API 429 rate limit 대응 — SDK에 내장 재시도가 없어 fetch 레벨에서 처리
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  retries = 3
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(input, init)
    if (res.status !== 429 || attempt >= retries) return res
    const retryAfterSec = Number(res.headers.get('Retry-After')) || 2 ** attempt
    await new Promise((r) => setTimeout(r, retryAfterSec * 1000))
  }
}
