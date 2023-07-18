import 'dotenv/config'
import mongoose, { Schema } from 'mongoose'
import { AnonArticle, AnonComment, AnonReply } from '../types/anonArticleTypes.ts'

export const anonArticleSchema = new Schema<AnonArticle>({
    id: {type: String, required: true},
    board: {type: String, required: true},
    title: {type: String, required: true},
    time_written: {type: Number, required: true},
    time_edited: {type: Number, required: true},
    content: {type: String, required: true},
    tags: {type: [String], required: true},
    password_sha256: {type: String, required: true},
    vote: {type: Number, required: false, default: 0}
})

export const anonCommentSchema = new Schema<AnonComment>({
    id: {type: String, requied: true},
    board: {type: String, required: true},
    articleId: {type: Number, requied: true},
    time_written: {type: Number, requied: true},
    time_edited: {type: Number, requied: true},
    content: {type: String, requied: true},
    password_sha256: {type: String, required: true},
    vote: {type: Number, requied: false, default: 0}
})

export const anonReplySchema = new Schema<AnonReply>({
    id: {type: String, requied: true},
    board: {type: String, required: true},
    parentId: {type: Number, requied: true},
    time_written: {type: Number, requied: true},
    time_edited: {type: Number, requied: true},
    content: {type: String, requied: true},
    password_sha256: {type: String, required: true},
    vote: {type: Number, requied: false, default: 0}
})

export const AnonArticleModel = mongoose.model<AnonArticle>('anonArticle',anonArticleSchema)
export const AnonCommentModel = mongoose.model<AnonComment>('anonComment',anonCommentSchema)
export const AnonReplyModel = mongoose.model<AnonReply>('anonReply',anonReplySchema)