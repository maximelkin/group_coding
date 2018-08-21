import * as Router from 'koa-router'
import {placementController, PlacementUpdate} from '../controllers/placement'
import {placementValidator} from '../validators/placement'
import {validateMiddleware} from '../helpers'

// include in /project/:projectId/...
export const placementRouter = new Router()
    .prefix('/placement/project/:projectId')
    .use(async (ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        return next()
    })
    .post('/',
        validateMiddleware(placementValidator.create),
        async ctx => {
            const placements: string[] = ctx.request.body as any
            const projectId = parseInt(ctx.params.projectId, 10)

            await placementController.create(ctx, ctx.state.user!, projectId, placements)
        })
    .put('/',
        validateMiddleware(placementValidator.update),
        async ctx => {
            const placementUpdates: PlacementUpdate[] = ctx.request.body as any
            const projectId = parseInt(ctx.params.projectId, 10)

            await placementController.update(ctx, ctx.state.user!, projectId, placementUpdates)
        })
    .delete('/',
        validateMiddleware(placementValidator.delete),
        async ctx => {
            const placements: number[] = ctx.request.body as any
            const projectId = parseInt(ctx.params.projectId, 10)

            await placementController.delete(ctx, ctx.state.user!, projectId, placements)
        })
