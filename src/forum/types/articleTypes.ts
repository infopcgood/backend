import { z } from 'zod'

export type State = {
  start: number
}

export const articleSchema = z.object({
  id: z.string(),
  board: z.string(),
  title: z.string(),
  time_written: z.number(),
  time_edited: z.number(),
  content: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
  vote: z.number()
})

export const commentSchema = z.object({
  id: z.string(),
  board: z.string(),
  articleId: z.number(),
  time_written: z.number(),
  time_edited: z.number(),
  content: z.string(),
  author: z.string(),
  vote: z.number()
})

export const replySchema = z.object({
  id: z.string(),
  board: z.string(),
  parentId: z.number(),
  time_written: z.number(),
  time_edited: z.number(),
  content: z.string(),
  author: z.string(),
  vote: z.number()
})

export type Article = z.infer<typeof articleSchema>
export type Comment = z.infer<typeof commentSchema>
export type Reply = z.infer<typeof replySchema>