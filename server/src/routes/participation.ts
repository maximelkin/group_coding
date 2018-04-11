import * as Router from 'koa-router'
import {participationController} from '../controllers/participation'
import {commonValidator} from '../validators/common'

export const participationRouter = new Router()
    .prefix('/participation')
    .use((ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        return next()
    })
    .post('/', async ctx => {
        const placementId = parseInt(ctx.request.body.placementId, 10)

        ctx.assert(commonValidator.nonNegativeNumber(placementId), 400, 'wrong placement id')

        await participationController.create(ctx, placementId, ctx.state.user)
    })
    .delete('/:id', async ctx => {
        const participationRequestId = parseInt(ctx.params.id, 10)

        ctx.assert(commonValidator.nonNegativeNumber(participationRequestId), 400, 'wrong placement id')

        await participationController.delete(ctx, participationRequestId, ctx.state.user)
    })
