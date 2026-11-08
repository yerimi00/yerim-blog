import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Post } from '@/types'

export function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'yyyy년 M월 d일', { locale: ko })
  } catch {
    return dateStr
  }
}

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function calculateReadingTime(content: string): number {
  const stripped = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#*_~[\]()!>|-]/g, '')
  const words = stripped.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function getRelatedPosts(current: Post, all: Post[], max = 3): Post[] {
  const others = all.filter((p) => p.id !== current.id)
  const scored = others.map((post) => {
    let score = 0
    if (post.series && post.series === current.series) score += 10
    const tagOverlap = post.tags.filter((t) => current.tags.includes(t)).length
    score += tagOverlap * 2
    return { post, score }
  })
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(({ post }) => post)
}

const SERIES_ORDER = ['Server', 'design', 'AI', 'volunteer', 'Front-end', 'Algorithm', 'PM/PO', 'projects', 'Optimization']

// ponytail: 목록에 없는 시리즈는 이름 해시로 색을 골라 겹칠 수 있다. 새 시리즈가 생기면 SERIES_ORDER와 --series-N을 늘린다
export function seriesColor(series: string): string {
  const known = SERIES_ORDER.indexOf(series)
  const index = known >= 0 ? known : series.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % SERIES_ORDER.length
  return `var(--series-${index + 1})`
}
