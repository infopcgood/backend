import Router from "koa-router"
import { Context, Next } from "koa"
import { z } from "zod"
import { validateToken } from "../../functions/tokenValidation.ts"

const novelAiRouter = new Router()

let accessToken: string
let available = false

function getRandomInt(max:number) {
    return Math.floor(Math.random() * max)
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array( buffer );
    const len = bytes.byteLength;
    for (let i = 0; i < len; i+=1) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return btoa( binary );
}

async function initNovelAiService(){
    const response = await fetch("https://api.novelai.net/user/login",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({key:process.env.NOVELAI_KEY})})
    accessToken = JSON.parse(await response.text()).accessToken
    available = true
}

novelAiRouter.get("/api/sharevice/novelai/generate_image/:mode", async (ctx: Context, next: Next) => {
    validateToken(ctx)
    ctx.assert(available,500)
    const queryparse = z.object({input:z.string()}).safeParse(ctx.query)
    let model: string;
    if(ctx.params.mode === "anime_curated"){
        model = "safe-diffusion"
    }
    else if(ctx.params.mode === "anime_full"){
        model = "nai-diffusion"
    }
    else{
        ctx.throw(400)
    }
    ctx.assert(queryparse.success,400)
    await fetch("https://api.novelai.net/ai/generate-image",{method:"POST",headers: {'Content-Type':'application/json','Authorization': `Bearer ${accessToken}`,'Accept': "*/*"},body:JSON.stringify({
        "input": `masterpiece, best quality, ${queryparse.data.input}`,
        "model": model,
        "action": "generate",
        "parameters": {
            "width": 768,
            "height": 512,
            "scale": 11,
            "sampler": "k_dpmpp_2m",
            "steps": 28,
            "seed": getRandomInt(10000000000),
            "n_samples": 1,
            "ucPreset": 0,
            "qualityToggle": true,
            "sm": false,
            "sm_dyn": false,
            "dynamic_thresholding": false,
            "controlnet_strength": 1,
            "legacy": false,
            "add_original_image": false,
            "negative_prompt": "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry"}})}
    ).then(async (response) => {
        ctx.status = response.status
        // ctx.response = response.data // i am a genius        ok apparently i wasn't
        ctx.body = arrayBufferToBase64(await response.arrayBuffer())
    })
    await next()
})

export default novelAiRouter
export const initNovelAi = initNovelAiService