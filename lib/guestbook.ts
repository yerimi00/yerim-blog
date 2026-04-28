import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const DB_ID = process.env.NOTION_GUESTBOOK_DATABASE_ID!

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: string
  isPublic?: boolean
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  const res = await notion.databases.query({
    database_id: DB_ID,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: 100,
  })

  return res.results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((page: any) => {
      const props = page.properties
      const message: string = props.Message?.title?.[0]?.plain_text ?? ''
      const name: string = props.Name?.rich_text?.[0]?.plain_text?.trim() || '익명'
      const isPublic: boolean = props.Public?.checkbox ?? true
      return { id: page.id, name, message, createdAt: page.created_time, isPublic }
    })
    .filter((e) => e.message.length > 0)
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
