import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const DB_ID = process.env.NOTION_GUESTBOOK_DATABASE_ID!

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: string
  isPublic?: boolean
  commentCount: number
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  const res = await notion.databases.query({
    database_id: DB_ID,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: 100,
  })

  const entries = res.results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((page: any) => {
      const props = page.properties
      const message: string = props.Message?.title?.[0]?.plain_text ?? ''
      const name: string = props.Name?.rich_text?.[0]?.plain_text?.trim() || '익명'
      const isPublic: boolean = props.Public?.checkbox ?? true
      return { id: page.id, name, message, createdAt: page.created_time, isPublic, commentCount: 0 }
    })
    .filter((e) => e.message.length > 0)

  const counts = await Promise.all(
    entries.map((e) =>
      notion.blocks.children.list({ block_id: e.id })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((r) => r.results.filter((b: any) => b.paragraph?.rich_text?.[0]?.plain_text).length)
        .catch(() => 0)
    )
  )

  return entries.map((e, i) => ({ ...e, commentCount: counts[i] }))
}

export async function addGuestbookEntry(
  message: string,
  name?: string,
  isPublic?: boolean,
): Promise<void> {
  await notion.pages.create({
    parent: { database_id: DB_ID },
    properties: {
      Message: {
        title: [{ text: { content: message.slice(0, 2000) } }],
      },
      Name: {
        rich_text: [{ text: { content: (name?.trim() || '익명').slice(0, 100) } }],
      },
      Public: {
        checkbox: isPublic ?? true,
      },
    },
  })
}

export interface GuestbookComment {
  id: string
  name: string
  message: string
  createdAt: string
}

export async function getComments(pageId: string): Promise<GuestbookComment[]> {
  const res = await notion.blocks.children.list({ block_id: pageId })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.results.map((block: any) => {
    const text: string = block.paragraph?.rich_text?.[0]?.plain_text ?? ''
    const sepIdx = text.indexOf('|')
    const name = sepIdx !== -1 ? text.slice(0, sepIdx).trim() : '익명'
    const message = sepIdx !== -1 ? text.slice(sepIdx + 1).trim() : text
    return { id: block.id, name, message, createdAt: block.created_time }
  }).filter((c) => c.message.length > 0)
}

export async function addComment(pageId: string, name: string, message: string): Promise<void> {
  await notion.blocks.children.append({
    block_id: pageId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: [{ type: 'paragraph', paragraph: { rich_text: [{ text: { content: `${(name.trim() || '익명').slice(0, 50)}|${message.trim().slice(0, 300)}` } }] } }] as any,
  })
}
