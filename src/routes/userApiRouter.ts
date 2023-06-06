import { Context, Next } from 'koa';
import Router from 'koa-router'
import { z } from 'zod';
import { State, userSchema } from '../types/userTypes.ts';
import { UserModel } from '../models/userModels.ts';

const userApiRouter = new Router<State>();

userApiRouter.get('/api/user/info/', async (ctx:Context, next: Next) => {
	console.log(ctx.query)
	const paramparse = z.object({ id: z.string() }).safeParse(ctx.query)
	ctx.assert(paramparse.success, 400)
	const data = await UserModel.findOne({id:parseInt(paramparse.data.id,10)}).lean().exec()
	ctx.assert(data,404)
	ctx.status = 200
	const parsedData = JSON.parse(JSON.stringify(data));
	parsedData.password_sha256 = null
	parsedData.email = null
	parsedData.phone_number = null
	parsedData.student_id = null
	parsedData.name = null
	ctx.body = parsedData
	await next()
})

userApiRouter.post('/api/user/manual-register', async (ctx:Context, next: Next) => {
	const bodyparse = userSchema.safeParse(ctx.request.body)
	ctx.assert(bodyparse.success, 400)
  
	const found = await UserModel.findOne({ id: bodyparse.data.id }).lean().exec()
	ctx.assert(found === null, 409)
  
	const model = new UserModel(bodyparse.data)
	await model.save()
  
	ctx.status = 201
  
	await next()
})

export default userApiRouter