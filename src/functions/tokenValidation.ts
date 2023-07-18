import { Context } from "koa"
import { TokenModel } from "../base/models/loginModels.ts"

async function validateTokenFunction(ctx:Context){
    ctx.assert(ctx.cookies.get('token'),401)
	const tokenData = await TokenModel.findOne({ token: ctx.cookies.get('token') }).lean().exec()
	ctx.assert(tokenData,401)
	if(tokenData.valid_until_timestamp < Date.now()){
		await TokenModel.deleteOne(tokenData)
		ctx.throw(401)
	}
	else if(tokenData.ip !== ctx.ip) {
		ctx.throw(401)
	}
	else if(tokenData.user_agent !== ctx.headers["user-agent"]) {
		ctx.throw(401)
	}
	return tokenData
}

// eslint-disable-next-line import/prefer-default-export
export const validateToken = validateTokenFunction