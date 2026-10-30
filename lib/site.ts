// 사이트 URL·이름 단일 출처 — 도메인 연결 시 NEXT_PUBLIC_SITE_URL만 바꾸면 된다
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://yerim-blog.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'yerim.dev'
export const SITE_DESCRIPTION = '피할 수 없다면 즐..즐입니다 ~ KIN'
