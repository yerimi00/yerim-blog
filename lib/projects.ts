import { cache } from 'react'
import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DATABASE_ID!

export type NotionProject = {
  id: string
  name: string
  slug: string
  featured: boolean
  description: string
  overview: string
  status: '완료' | '진행중'
  period: string
  updatedAt: string
  roles: string[]
  tech: string[]
  award: string
  github: string
  url: string
  image: string
}

function extractProject(page: PageObjectResponse): NotionProject {
  const p = page.properties

  const titleProp = p.Name
  const name = titleProp?.type === 'title' ? titleProp.title[0]?.plain_text ?? '' : ''

  const slugProp = p.Slug
  const slug = slugProp?.type === 'rich_text' ? slugProp.rich_text[0]?.plain_text ?? '' : ''

  const featuredProp = p.Featured
  const featured = featuredProp?.type === 'checkbox' ? featuredProp.checkbox : false

  const descProp = p.Description
  const description = descProp?.type === 'rich_text' ? descProp.rich_text[0]?.plain_text ?? '' : ''

  const overviewProp = p.Overview
  const overview = overviewProp?.type === 'rich_text' ? overviewProp.rich_text[0]?.plain_text ?? '' : ''

  const statusProp = p.Status
  const status = (statusProp?.type === 'select'
    ? statusProp.select?.name ?? '완료'
    : '완료') as '완료' | '진행중'

  const periodProp = p.Period
  const period = periodProp?.type === 'rich_text' ? periodProp.rich_text[0]?.plain_text ?? '' : ''

  const updatedAtProp = p.UpdatedAt
  const updatedAt = updatedAtProp?.type === 'rich_text' ? updatedAtProp.rich_text[0]?.plain_text ?? '' : ''

  const rolesProp = p.Roles
  const roles = rolesProp?.type === 'multi_select' ? rolesProp.multi_select.map((r) => r.name) : []

  const techProp = p.Tech
  const tech = techProp?.type === 'multi_select' ? techProp.multi_select.map((t) => t.name) : []

  const awardProp = p.Award
  const award = awardProp?.type === 'rich_text' ? awardProp.rich_text[0]?.plain_text ?? '' : ''

  const githubProp = p.GitHub
  const github = githubProp?.type === 'url' ? githubProp.url ?? '' : ''

  const urlProp = p.URL
  const url = urlProp?.type === 'url' ? urlProp.url ?? '' : ''

  const imageProp = p.Image
  const image = imageProp?.type === 'rich_text' ? imageProp.rich_text[0]?.plain_text ?? '' : ''

  return { id: page.id, name, slug, featured, description, overview, status, period, updatedAt, roles, tech, award, github, url, image }
}

export const getAllProjects = cache(async (): Promise<NotionProject[]> => {
  const response = await notion.databases.query({
    database_id: PROJECTS_DB_ID,
    sorts: [{ property: 'Period', direction: 'descending' }],
  })
  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(extractProject)
})

export async function getProjectBySlug(slug: string): Promise<NotionProject | null> {
  const response = await notion.databases.query({
    database_id: PROJECTS_DB_ID,
    filter: { property: 'Slug', rich_text: { equals: slug } },
  })
  if (!response.results.length) return null
  const page = response.results[0]
  if (!('properties' in page)) return null
  return extractProject(page as PageObjectResponse)
}
