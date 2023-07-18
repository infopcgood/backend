import { Context, Next } from "koa"
import Router from "koa-router"

const availableBoards = ['main','study','gaming','future']
const availableAnonBoards = ['anon','forest']
type State = {
    start: number
}

const boardRouter = new Router<State>()

boardRouter.get('/api/board:id', async (ctx: Context, next: Next) => {
    ctx.params.
})