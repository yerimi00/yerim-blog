export interface Post {
  id: string
  title: string
  slug: string
  description: string
  date: string
  tags: string[]
  series?: string
  coverImage?: string
  views?: number
  published: boolean
}

export interface Series {
  name: string
  posts: Post[]
  description?: string
}

export interface Comment {
  id: string
  author: string
  content: string
  date: string
  postId: string
}
