import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

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
