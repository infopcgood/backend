import Router from "koa-router";
import axios from "axios";

const novelAiRouter = new Router();

async function initNovelAiService(){
    try {
        const response = await axios.post("https://api.novelai.net/user/login",{key:process.env.NOVELAI_KEY})
    }
    catch {
        // something is very very wrong here but ima leave it blank
    }
}

export default novelAiRouter
export const initNovelAi = initNovelAiService