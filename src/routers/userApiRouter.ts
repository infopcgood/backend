import { Context, Next } from 'koa';
import Router from 'koa-router'

const userApiRouter = new Router();

userApiRouter.get('/api/user/info:id', async (ctx:Context, next: Next) => {
	await next()
})

userApiRouter.post('/api/user/manual-register', async (ctx:Context, next: Next) => {
	await next()
})

export default userApiRouter