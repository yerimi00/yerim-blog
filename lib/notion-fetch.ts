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

// 429 재시도 대기까지 포함해 기다린다 (SDK 기본 60초면 빌드 중 요청이 몰릴 때 타임아웃)
export const NOTION_TIMEOUT_MS = 120_000
