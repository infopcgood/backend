import { z } from 'zod'

export type State = {
  start: number
}

export const anonArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  time_written: z.number(),
  time_edited: z.number(),
  content: z.string(),
  tags: z.array(z.string()),
  vote: z.number()
})

export const anonCommentSchema = z.object({
  id: z.string(),
  articleId: z.number(),
  time_written: z.number(),
  time_edited: z.number(),
  content: z.string(),
  vote: z.number()
})

export const anonReplySchema = z.object({
  id: z.string(),
  parentId: z.number(),
  time_written: z.number(),
  time_edited: z.number(),
  content: z.string(),
  vote: z.number()
})

export type Article = z.infer<typeof anonArticleSchema>
export type Comment = z.infer<typeof anonCommentSchema>
export type Reply = z.infer<typeof anonReplySchema>