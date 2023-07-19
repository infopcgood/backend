import { Context, Next } from "koa"
import Router from "koa-router"
import { ArticleModel } from "../models/articleModels"
import { validateToken } from "../../functions/tokenValidation"
import { AnonArticleModel } from "../models/anonArticleModels"

export const availableBoards = ['main','study','gaming','future']
export const availableAnonBoards = ['anon','forest']
type State = {
    start: number
}

const boardRouter = new Router<State>()

boardRouter.get('/api/board:id', async (ctx: Context, next: Next) => {
    await validateToken(ctx)
    const boardName = ctx.params.id
    if (availableBoards.find(boardName) !== undefined) {
        ctx.status = 200
        ctx.body = await ArticleModel.find({ board: boardName },{ projection: {__v: 0, _id: 0, content: 0} }).sort('-time_written')
    }
    else if (availableAnonBoards.find(boardName) !== undefined) {
        ctx.status = 200
        ctx.body = await AnonArticleModel.find({ board: boardName },{ projection: {__v: 0, _id: 0, content: 0, password_sha256: 0} }).sort('-time_written')
    }
    else {
        ctx.throw(404)
    }
    await next()
})