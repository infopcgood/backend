import { Context, Next } from 'koa';
import Router from 'koa-router'
import { z } from 'zod';
import Crypto from 'crypto'
import { State } from '../types/loginTypes.ts';
import { UserModel } from '../models/userModels.ts';
import { TokenModel } from '../models/loginModels.ts';

const loginRouter = new Router<State>();

loginRouter.post('/api/login', async (ctx:Context, next: Next) => {
    console.log(ctx.query.username)
	const found = await UserModel.findOne({ username: ctx.query.username }).lean().exec()
    ctx.assert(found, 404)
    ctx.assert(found.password_sha256 === ctx.query.password_sha256, 401)
    ctx.status = 200
    const token = new TokenModel({token: Crypto.randomBytes(64).toString('hex'), username: ctx.query.username, ip:ctx.ip, user_agent: ctx.headers['user-agent'], valid_until_timestamp: Date.now() + 604800})
    await token.save()
    const parsedToken = JSON.parse(JSON.stringify(token));
    // eslint-disable-next-line no-underscore-dangle
    delete parsedToken._id
    // eslint-disable-next-line no-underscore-dangle
    delete parsedToken.__v
    ctx.body = parsedToken
    await next()
})

loginRouter.post('/api/register_request', async (ctx:Context, next: Next) => {
    await next()
})

export default loginRouter