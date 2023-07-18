import { Context, Next } from 'koa'
import Router from 'koa-router'
import { z } from 'zod'
import { State, userSchema } from '../types/userTypes.ts'
import { UserModel } from '../models/userModels.ts'
import { validateToken } from '../../functions/tokenValidation.ts'

const userApiRouter = new Router<State>()

userApiRouter.get('/api/user/info/:username', async (ctx:Context, next: Next) => {
	const paramparse = z.object({ username: z.string() }).safeParse(ctx.params)
	ctx.assert(paramparse.success, 400)
	const data = await UserModel.findOne({username: paramparse.data.username }).lean().exec()
	ctx.assert(data,404)
	ctx.status = 200
	const parsedData = JSON.parse(JSON.stringify(data))
	delete parsedData.password_sha256
	delete parsedData.email
	delete parsedData.phone_number
	delete parsedData.student_id
	delete parsedData.name
	// eslint-disable-next-line no-underscore-dangle
	delete parsedData._id
	// eslint-disable-next-line no-underscore-dangle
	delete parsedData.__v
	ctx.body = parsedData
	await next()
})

userApiRouter.get('/api/user/sensitive-info', async (ctx:Context, next: Next) => {
	const tokenData = validateToken(ctx)
	const data = await UserModel.findOne({ username: (await tokenData).username }).lean().exec()
	ctx.assert(data,500)
	ctx.status = 200
	const parsedData = JSON.parse(JSON.stringify(data))
	delete parsedData.password_sha256
	// eslint-disable-next-line no-underscore-dangle
	delete parsedData._id
	// eslint-disable-next-line no-underscore-dangle
	delete parsedData.__v
	ctx.body = parsedData
	await next()
})

export default userApiRouter