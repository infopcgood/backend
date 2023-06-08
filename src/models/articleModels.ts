import 'dotenv/config'
import { Schema, createConnection } from 'mongoose'
import { Article, Comment, Reply } from '../types/articleTypes.ts'
import connection from '../index.ts'

export const articleSchema = new Schema<Article>({
    id: {type: Number, required: true},
    title: {type: String, required: true},
    time_written: {type: Number, required: true},
    time_edited: {type: Number, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    tags: {type: [String], required: true},
    vote: {type: Number, required: true}
})

export const commentSchema = new Schema<Comment>({
    id: {type: Number, requied: true},
    articleId: {type: Number, requied: true},
    time_written: {type: Number, requied: true},
    time_edited: {type: Number, requied: true},
    content: {type: String, requied: true},
    author: {type: String, requied: true},
    vote: {type: Number, requied: true}
})

export const replySchema = new Schema<Reply>({
    id: {type: Number, requied: true},
    parentId: {type: Number, requied: true},
    time_written: {type: Number, requied: true},
    time_edited: {type: Number, requied: true},
    content: {type: String, requied: true},
    author: {type: String, requied: true},
    vote: {type: Number, requied: false, default: 0}
})

export const ArticleModel = connection.model<Article>('article',articleSchema)
export const CommentModel = connection.model<Comment>('comment',commentSchema)
export const ReplyModel = connection.model<Reply>('reply',replySchema)