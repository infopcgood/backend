import { z } from 'zod'

export type State = {
  start: number
}

export const anonArticleSchema = z.object({
  id: z.string(),
  board: z.string(),
  title: z.string(),
  time_written: z.number(),
  time_edited: z.number(),
  content: z.string(),
  tags: z.array(z.string()),
  password_sha256: z.string(),
  vote: z.number()
})

export const anonCommentSchema = z.object({
  id: z.string(),
  board: z.string(),
  articleId: z.number(),
  time_written: z.number(),
  time_edited: z.number(),
  content: z.string(),
  password_sha256: z.string(),
  vote: z.number()
})

export const anonReplySchema = z.object({
  id: z.string(),
  board: z.string(),
  parentId: z.number(),
  time_written: z.number(),
  time_edited: z.number(),
  content: z.string(),
  password_sha256: z.string(),
  vote: z.number()
})

export type AnonArticle = z.infer<typeof anonArticleSchema>
export type AnonComment = z.infer<typeof anonCommentSchema>
export type AnonReply = z.infer<typeof anonReplySchema>