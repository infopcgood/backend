import { Context, Next } from 'koa';
import Router from 'koa-router'
import { z } from 'zod';
import Crypto from 'crypto';
import { State } from '../types/articleTypes.ts';
import { ArticleModel } from '../models/articleModels.ts';
import { validateToken } from '../functions/tokenValidation.ts';
import { UserModel } from '../models/userModels.ts';

const articleRouter = new Router<State>();

articleRouter.get('/api/article/:id', async (ctx: Context, next: Next) => {
    await validateToken(ctx.query.token,ctx)
    const found = await ArticleModel.findOne({id:ctx.params.id}).lean().exec()
    ctx.assert(found,404)
    ctx.status = 200
    const parsedData = JSON.parse(JSON.stringify(found))
    // eslint-disable-next-line no-underscore-dangle
    delete parsedData.__v
    // eslint-disable-next-line no-underscore-dangle
    delete parsedData._id
    ctx.body = parsedData
    await next()
})

articleRouter.post('/api/article/new', async (ctx: Context, next: Next) => {
    const tokenData =  validateToken(ctx.query.token,ctx)
	const userData = await UserModel.findOne({ username: (await tokenData).username }).lean().exec()
	ctx.assert(userData,500)
	const paramparse = z.object({ title: z.string(), content: z.string(), tags: z.array(z.string())}).safeParse(ctx.request.body)
    ctx.assert(paramparse.success,400)
    let articleId = Crypto.randomBytes(12).toString('hex')
    let document = await ArticleModel.findOne({ id: articleId }).exec()
    while(document !== null){
        articleId = Crypto.randomBytes(12).toString('hex')
        // eslint-disable-next-line no-await-in-loop
        document = await ArticleModel.findOne({ id: articleId }).exec()
    }
    const time = Date.now()
    const model = new ArticleModel({id: articleId, title: paramparse.data.title, time_written: time, time_edited: time, content: paramparse.data.content, tags: paramparse.data.tags, author: userData.username, vote: 0})
    model.save()
    ctx.status = 201
    ctx.body = model
    await next()
})

export default articleRouter