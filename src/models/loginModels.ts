import 'dotenv/config'
import mongoose, { Schema } from 'mongoose'
import { RegisterToken, Token } from '../types/loginTypes.ts'

export const tokenSchema = new Schema<Token>({
    token: {type: String, required: true},
    username: {type: String, required: true},
    ip: {type: String, required: true},
    user_agent: {type: String, required: true},
    valid_until_timestamp: {type: Number, required: true}
})

export const registerTokenSchema = new Schema<RegisterToken>({
    token: {type: String, required: true},
    email: {type: String, required: true},
    valid_until_timestamp: {type: Number, required: true}
})

export const TokenModel = mongoose.model<Token>('token', tokenSchema)
export const RegisterTokenModel = mongoose.model<RegisterToken>('registerToken', registerTokenSchema)