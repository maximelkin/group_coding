import * as Router from 'koa-router'
import {commentController} from '../controllers/comment'
import {commentValidator} from '../validators/comment'
import {validateMiddleware} from '../helpers'

export const commentRouter = new Router()
    .prefix('/comment')

    .get('/project/:projectId',
        validateMiddleware(commentValidator.readByProject),
        async ctx => {
            const {projectId} = ctx.params
            await commentController.readByProject(ctx, parseInt(projectId, 10))
        })

    .get('/user/:username',
        validateMiddleware(commentValidator.readByUser),
        async ctx => {
            const {username} = ctx.params
            let {limit, offset} = ctx.query
            limit = limit && parseInt(limit, 10) || 30
            offset = offset && parseInt(offset, 10) || 0

            await commentController.readByUser(ctx, username, {limit, offset})
        })

    .post('/project/:projectId',
        validateMiddleware(commentValidator.create),
        async ctx => {
            const {projectId} = ctx.params
            const {message, parentCommentId} = ctx.request.body as any
            const user = ctx.state.user
            if (!ctx.isAuthenticated()) {
                return ctx.throw(401)
            }
            await commentController.create(ctx, user, parseInt(projectId, 10), {message, parentCommentId})
        })
