import { Context, Next } from 'koa';
import Router from 'koa-router'
import { z } from 'zod';
import { State } from '../types/tokenTypes.ts';

const tokenRouter = new Router<State>();

tokenRouter.get('/api/login', async (ctx:Context, next: Next) => {
    await next()
})

tokenRouter.post('/api/user/manual-register', async (ctx:Context, next: Next) => {
    await next()
})

export default tokenRouter