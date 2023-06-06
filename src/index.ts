import Koa, { Context, Next } from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import 'dotenv/config'
import { Schema, createConnection } from "mongoose"
import userApiRouter from "./routes/userApiRouter.ts"
import commandLineLogger from 'koa-logger'

const app = new Koa();
const router = new Router();
const PORT = 3000

app.use(bodyParser())
app.use(commandLineLogger())

const connection = createConnection(process.env.MONGODB_URI ?? "")
export default connection

router.get('/api/mint-chocolate', async (ctx:Context, next: Next) => {
	ctx.status = 403
	await next()
})

app.use(userApiRouter.routes());
app.use(router.routes());

app.listen(PORT, () => {
    console.log('Server is listening.');
});