import { z } from 'zod'

export type State = {
  start: number
}

export const userSchema = z.object({
    id: z.number(),
    password_sha256: z.string(),
    username: z.string(),
	name: z.string(),
    nickname: z.string(),
	student_id: z.number(),
    account_creation_timestamp: z.number(),
    email: z.string(),
    phone_number: z.number(),
    exp: z.number(),
    is_admin: z.boolean(),
    profile_image_url: z.string()
})

export type User = z.infer<typeof userSchema>