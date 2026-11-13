// 사이트 URL·이름 단일 출처 — 도메인 연결 시 NEXT_PUBLIC_SITE_URL만 바꾸면 된다
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yerimi00.com').replace(/\/$/, '')
export const SITE_NAME = '예림 개발 블로그'
export const SITE_DOMAIN_NAME = 'yerimi00.com'
export const AUTHOR_NAME = '이예림'
export const SITE_DESCRIPTION = '개발자 이예림의 개발 블로그예요. 만들면서 부딪힌 문제와 배운 것을 기록해요.'
