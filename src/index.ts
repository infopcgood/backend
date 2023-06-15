import Koa, { Context, Next } from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import 'dotenv/config'
import mongoose from "mongoose"
import commandLineLogger from 'koa-logger'
import userApiRouter from "./base/routes/userApiRouter.ts"
import loginRouter from './base/routes/loginRouter.ts'
import articleRouter from './forum/routes/articleRouter.ts'
import novelAiRouter, { initNovelAi } from './sharevice/routes/novelAiRoutes.ts'

mongoose.connect(process.env.MONGODB_URI ?? "")

const app = new Koa()
const router = new Router()
const PORT = 3000

app.use(bodyParser())
app.use(commandLineLogger())

router.get('/api/mint-chocolate', async (ctx:Context, next: Next) => {
	ctx.status = 403
	await next()
})

app.use(userApiRouter.routes())
app.use(loginRouter.routes())
app.use(articleRouter.routes())
app.use(novelAiRouter.routes())
app.use(router.routes())

// eslint-disable-next-line func-names
initNovelAi().then(function() {
	app.listen(PORT, () => {
    	// eslint-disable-next-line no-console
		console.log(`Server running on port ${PORT}`)
})})