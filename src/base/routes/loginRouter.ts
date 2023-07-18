import { Context, Next } from 'koa'
import Router from 'koa-router'
import Crypto from 'crypto'
import { State } from '../types/loginTypes.ts'
import { UserModel } from '../models/userModels.ts'
import { RegisterTokenModel, TokenModel } from '../models/loginModels.ts'
import { userSchema } from '../types/userTypes.ts'
import { z } from 'zod'

const loginRouter = new Router<State>()

loginRouter.post('/api/login', async (ctx:Context, next: Next) => {
	const found = await UserModel.findOne({ username: ctx.query.username }).lean().exec()
    ctx.assert(found, 404)
    ctx.assert(found.password_sha256 === ctx.query.password_sha256, 401)
    ctx.status = 200
    const token = new TokenModel({ token: Crypto.randomBytes(64).toString('hex'), username: ctx.query.username, ip:ctx.ip, user_agent: ctx.headers['user-agent'], valid_until_timestamp: Date.now() + 604800000 })
    const savedToken = await token.save()
    const parsedToken = JSON.parse(JSON.stringify(savedToken))
    // eslint-disable-next-line no-underscore-dangle
    delete parsedToken._id
    // eslint-disable-next-line no-underscore-dangle
    delete parsedToken.__v
    ctx.body = parsedToken
    ctx.cookies.set('token', parsedToken.token, { httpOnly: true, maxAge: 604800000 })
    await next()
})

loginRouter.post('/api/register-request', async (ctx:Context, next: Next) => {
	const paramparse = z.object({ email: z.string() }).safeParse(ctx.query)
    ctx.assert(paramparse.success, 400)
    ctx.assert(paramparse.data.email.slice(5) === '@sshs.hs.kr',400) // check if email is ?????@sshs.hs.kr
    ctx.assert(!isNaN(parseInt(paramparse.data.email.slice(0,5))),400) //check if first 5 digits of email is number
    const registerToken = await new RegisterTokenModel({ token: Crypto.randomBytes(48).toString('hex'), email: paramparse.data.email, valid_until_timestamp: Date.now() + 604800000 }).save()
    const token = registerToken.token
    // TODO: send token with register URL by email.
    // sendmail/dovecot setup on server is needed, also need to setup MX record on domain, etc...
    // eslint-disable-next-line no-console
    console.log(token)
    ctx.throw(501)
    await next()
})

loginRouter.post('/api/finalize-register', async (ctx:Context, next: Next) => {
	const paramparse = z.object({ token: z.string() }).safeParse(ctx.query)
    ctx.assert(paramparse.success, 400)
    const foundRegisterToken = await RegisterTokenModel.findOne({ token: paramparse.data.token }).lean().exec()
    ctx.assert(foundRegisterToken, 401)
	const bodyparse = userSchema.safeParse(ctx.request.body)
	ctx.assert(bodyparse.success, 400)
	const foundExistingUser = await UserModel.findOne({ username: bodyparse.data.username }).lean().exec()
	ctx.assert(foundExistingUser === null, 409)
	const model = new UserModel(bodyparse.data)
    ctx.assert(bodyparse.data.email === foundRegisterToken.email, 400)
    ctx.assert(bodyparse.data.student_id === parseInt(foundRegisterToken.email.slice(0,5)), 400)
	await model.save()
	ctx.status = 201
    await next()
})

loginRouter.post('/api/manual-register', async (ctx:Context, next: Next) => {
	const bodyparse = userSchema.safeParse(ctx.request.body)
	ctx.assert(bodyparse.success, 400)
	const found = await UserModel.findOne({ username: bodyparse.data.username }).lean().exec()
	ctx.assert(found === null, 409)
	const model = new UserModel(bodyparse.data)
	await model.save()
	ctx.status = 201
	await next()
})

export default loginRouter