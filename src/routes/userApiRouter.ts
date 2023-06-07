import { Context, Next } from 'koa';
import Router from 'koa-router'
import { z } from 'zod';
import { State, userSchema } from '../types/userTypes.ts';
import { UserModel } from '../models/userModels.ts';
import { TokenModel } from '../models/loginModels.ts';

const userApiRouter = new Router<State>();

async function validateToken(tokenStr:string, ctx:Context, next:Next){
	const tokenData = await TokenModel.findOne({ token: tokenStr }).lean().exec()
	ctx.assert(tokenData,401)
	if(tokenData.valid_until_timestamp > Date.now()){
		await TokenModel.deleteOne(tokenData)
		ctx.throw(401)
	}
	return tokenData
}

userApiRouter.get('/api/user/info/:username', async (ctx:Context, next: Next) => {
	const paramparse = z.object({ username: z.string() }).safeParse(ctx.params)
	ctx.assert(paramparse.success, 400)
	const data = await UserModel.findOne({username: paramparse.data.username }).lean().exec()
	ctx.assert(data,404)
	ctx.status = 200
	const parsedData = JSON.parse(JSON.stringify(data));
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
	const paramparse = z.object({ token: z.string() }).safeParse(ctx.query)
	ctx.assert(paramparse.success, 400)
	const tokenData = validateToken(paramparse.data.token, ctx, next)
	const data = await UserModel.findOne({ username: (await tokenData).username }).lean().exec()
	ctx.assert(data,500)
	ctx.status = 200
	const parsedData = JSON.parse(JSON.stringify(data));
	delete parsedData.password_sha256
	// eslint-disable-next-line no-underscore-dangle
	delete parsedData._id
	// eslint-disable-next-line no-underscore-dangle
	delete parsedData.__v
	ctx.body = parsedData
	await next()
})

userApiRouter.post('/api/user/manual-register', async (ctx:Context, next: Next) => {
	const bodyparse = userSchema.safeParse(ctx.request.body)
	ctx.assert(bodyparse.success, 400)
  
	const found = await UserModel.findOne({ username: bodyparse.data.username }).lean().exec()
	ctx.assert(found === null, 409)
  
	const model = new UserModel(bodyparse.data)
	await model.save()
  
	ctx.status = 201
  
	await next()
})

userApiRouter.delete('/api/user/manual-delete/:username', async (ctx: Context, next: Next) => {
	const paramparse = z.object({ username: z.string() }).safeParse(ctx.params)
	ctx.assert(paramparse.success, 400)
	const document = await UserModel.findOne({ username: paramparse.data.username }).exec()
	ctx.assert(document, 404)
  
	await document.deleteOne()
  
	ctx.status = 200 // maybe 204
  
	await next()
  })

export default userApiRouter