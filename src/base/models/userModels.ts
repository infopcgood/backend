import 'dotenv/config'
import mongoose, { Schema } from 'mongoose'
import { User } from '../types/userTypes.ts'

export const userSchema = new Schema<User>({
    password_sha256: {type: String, required: true},
    username: {type: String, required: true},
	name: {type: String, required: true},
    nickname: {type: String, required: true},
	student_id: {type: Number, required: true},
    account_creation_timestamp: {type: Number, required: true},
    email: {type: String, required: true},
    phone_number: {type: Number, required: true},
    exp: {type: Number, required: false, default:0},
    is_admin: {type: Boolean, required: false, default:false},
    profile_image_url: {type: String, required: true},
})

export const UserModel = mongoose.model<User>('user', userSchema)
