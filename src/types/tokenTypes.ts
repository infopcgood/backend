import { z } from 'zod'

export type State = {
  start: number
}

export const tokenSchema = z.object({
    token: z.string(),
    user_id: z.number(),
    ip: z.string(),
    user_agent: z.string(),
    valid_until_timestamp: z.number()
})

export type Token = z.infer<typeof tokenSchema>