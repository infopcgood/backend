import { z } from 'zod'

export type State = {
  start: number
}

export const tokenSchema = z.object({
    token: z.string(),
    username: z.string(),
    ip: z.string(),
    user_agent: z.string(),
    valid_until_timestamp: z.number()
})

export const registerTokenSchema = z.object({
  token: z.string(),
  email: z.string(),
  valid_until_timestamp: z.number()
})

export type Token = z.infer<typeof tokenSchema>
export type RegisterToken = z.infer<typeof registerTokenSchema>