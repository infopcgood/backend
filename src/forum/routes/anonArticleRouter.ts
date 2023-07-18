import { Context, Next } from 'koa'
import Router from 'koa-router'
import { z } from 'zod'
import Crypto from 'crypto'
import { State } from '../types/anonArticleTypes.js'
import { AnonArticleModel } from '../models/anonArticleModels.js'
import { validateToken } from '../../functions/tokenValidation.js'
import { UserModel } from '../../base/models/userModels.js'

const anonArticleRouter = new Router<State>()

anonArticleRouter.get('/api/anon-article/:id', async (ctx: Context, next: Next) => {
    await validateToken(ctx)
    const found = await AnonArticleModel.findOne({id:ctx.params.id}).lean().exec()
    ctx.assert(found, 404)
    ctx.status = 200
    const parsedData = JSON.parse(JSON.stringify(found))
    // eslint-disable-next-line no-underscore-dangle
    delete parsedData.__v
    // eslint-disable-next-line no-underscore-dangle
    delete parsedData._id
    ctx.body = parsedData
    await next()
})

anonArticleRouter.post('/api/anon-article/new', async (ctx: Context, next: Next) => {
    await validateToken(ctx)
	const bodyparse = z.object({ title: z.string(), content: z.string(), tags: z.array(z.string()), password_sha256: z.string()}).safeParse(ctx.request.body)
    ctx.assert(bodyparse.success, 400)
    let articleId = Crypto.randomBytes(16).toString('hex')
    let document = await AnonArticleModel.findOne({ id: articleId }).lean().exec()
    while(document !== null){
        articleId = Crypto.randomBytes(16).toString('hex')
        // eslint-disable-next-line no-await-in-loop
        document = await AnonArticleModel.findOne({ id: articleId }).lean().exec()
    }
    const time = Date.now()
    const model = new AnonArticleModel({id: articleId, title: bodyparse.data.title, time_written: time, time_edited: time, content: bodyparse.data.content, tags: bodyparse.data.tags, password_sha256: bodyparse.data.password_sha256})
    model.save()
    ctx.status = 201
    const parsedModel = JSON.parse(JSON.stringify(model))
    // eslint-disable-next-line no-underscore-dangle
    delete parsedModel.__v
    // eslint-disable-next-line no-underscore-dangle
    delete parsedModel._id
    ctx.body = parsedModel
    await next()
})

anonArticleRouter.put('/api/anon-article/edit/:id', async (ctx: Context, next: Next) => {
    await validateToken(ctx)
    const bodyparse = z.object({ title: z.string(), content: z.string(), tags: z.array(z.string()), password_sha256: z.string()}).safeParse(ctx.request.body)
    ctx.assert(bodyparse.success, 400)
    const found = await AnonArticleModel.findOne({id: ctx.params.id}).exec()
    ctx.assert(found, 404)
    ctx.assert(found.password_sha256 === bodyparse.data.password_sha256, 401)
    found.title = bodyparse.data.title
    found.content = bodyparse.data.content
    found.tags = bodyparse.data.tags
    found.time_edited = Date.now()
    found.save()
    ctx.status = 200
    const parsedData = JSON.parse(JSON.stringify(found))
    // eslint-disable-next-line no-underscore-dangle
    delete parsedData.__v
    // eslint-disable-next-line no-underscore-dangle
    delete parsedData._id
    ctx.body = parsedData
    await next()
})

anonArticleRouter.delete('/api/anon-article/delete/:id', async (ctx: Context, next: Next) => {
    await validateToken(ctx)
    const found = await AnonArticleModel.findOne({id:ctx.params.id}).exec()
    const queryparse = z.object({ password_sha256: z.string() }).safeParse(ctx.query)
    ctx.assert(queryparse.success, 400)
    ctx.assert(found, 404)
    ctx.assert(found.password_sha256 === queryparse.data.password_sha256, 401)
    found.deleteOne()
    ctx.status = 200
    await next()
})

export default anonArticleRouter