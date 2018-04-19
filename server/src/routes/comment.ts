import * as Router from 'koa-router'
import {commentController} from '../controllers/comment'
import validate = require('koa-joi-validate')
import {commentValidator} from '../validators/comment'

export const commentRouter = new Router()
    .prefix('/comment')

    .get('/project/:projectId',
        validate(commentValidator.readByProject),
        async ctx => {
            const {projectId} = ctx.params
            await commentController.readByProject(ctx, parseInt(projectId, 10))
        })

    .get('/user/:username',
        validate(commentValidator.readByUser),
        async ctx => {
            const {username} = ctx.params
            let {limit, offset} = ctx.params
            limit = limit && parseInt(limit, 10) || 30
            offset = offset && parseInt(offset, 10) || 0

            await commentController.readByUser(ctx, username, {limit, offset})
        })

    .post('/project/:projectId',
        validate(commentValidator.create),
        async ctx => {
            const {projectId} = ctx.params
            const {message, parentCommentId} = ctx.request.body
            const user = ctx.state.user
            if (!ctx.isAuthenticated()) {
                return ctx.throw(401)
            }
            await commentController.create(ctx, user, parseInt(projectId, 10), {message, parentCommentId})
        })
