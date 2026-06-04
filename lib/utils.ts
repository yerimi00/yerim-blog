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
