import type { ComponentType } from 'react'

// Lab 실험 목록. 새 데모는 components/에 만들고 여기에 slug로 등록한다
export type DemoMeta = { title: string; description: string }

export const DEMOS: Record<string, DemoMeta> = {}

export const DEMO_COMPONENTS: Record<string, ComponentType> = {}
