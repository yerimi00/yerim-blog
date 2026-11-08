import type { NotionProject } from '@/lib/projects'

// Notion Roles에는 직무(FE·BE…)와 팀 내 위치(팀원·개발팀장)가 섞여 있어 나눠서 보여준다
const POSITIONS = ['팀원', '개발팀장']

export const disciplinesOf = (p: NotionProject) => p.roles.filter((r) => !POSITIONS.includes(r))
export const isLead = (p: NotionProject) => p.roles.includes('개발팀장')

// "2025.08 ~ 2025.09" → "2025". 연도가 없으면 기타
export const yearOf = (p: NotionProject) => (p.period || p.updatedAt).match(/\d{4}/)?.[0] ?? '기타'
