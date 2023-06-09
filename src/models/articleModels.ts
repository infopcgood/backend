import 'dotenv/config'
import mongoose, { Schema } from 'mongoose'
import { Article, Comment, Reply } from '../types/articleTypes.ts'

export const articleSchema = new Schema<Article>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    time_written: {type: Number, required: true},
    time_edited: {type: Number, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    tags: {type: [String], required: true},
    vote: {type: Number, required: true}
})

export const commentSchema = new Schema<Comment>({
    id: {type: String, requied: true},
    articleId: {type: Number, requied: true},
    time_written: {type: Number, requied: true},
    time_edited: {type: Number, requied: true},
    content: {type: String, requied: true},
    author: {type: String, requied: true},
    vote: {type: Number, requied: true}
})

export const replySchema = new Schema<Reply>({
    id: {type: String, requied: true},
    parentId: {type: Number, requied: true},
    time_written: {type: Number, requied: true},
    time_edited: {type: Number, requied: true},
    content: {type: String, requied: true},
    author: {type: String, requied: true},
    vote: {type: Number, requied: false, default: 0}
})

export const ArticleModel = mongoose.model<Article>('article',articleSchema)
export const CommentModel = mongoose.model<Comment>('comment',commentSchema)
export const ReplyModel = mongoose.model<Reply>('reply',replySchema)