import * as Router from 'koa-router'
import {participationController} from '../controllers/participation'
import {participationValidator} from '../validators/participation'
import {validateMiddleware} from '../helpers'

export const participationRouter = new Router()
    .prefix('/participation')
    .use(async (ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        return next()
    })
    .post('/placement/:placementId',
        validateMiddleware(participationValidator.create),
        async ctx => {
            const placementId = parseInt(ctx.params.placementId, 10)

            await participationController.create(ctx, placementId, ctx.state.user)
        })
    .delete('/:id',
        validateMiddleware(participationValidator.delete),
        async ctx => {
            const participationRequestId = parseInt(ctx.params.id, 10)

            await participationController.delete(ctx, participationRequestId, ctx.state.user)
        })
