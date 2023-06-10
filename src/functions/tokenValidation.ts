import { Context } from "koa"
import { TokenModel } from "../base/models/loginModels.ts"

async function validateTokenFunction(tokenStr:unknown, ctx:Context){
    if(typeof(tokenStr)!==typeof('hello')){
        ctx.throw(400)
    }
	const tokenData = await TokenModel.findOne({ token: tokenStr }).lean().exec()
	ctx.assert(tokenData,401)
	if(tokenData.valid_until_timestamp < Date.now()){
		await TokenModel.deleteOne(tokenData)
		ctx.throw(401)
	}
	return tokenData
}

// eslint-disable-next-line import/prefer-default-export
export const validateToken = validateTokenFunction