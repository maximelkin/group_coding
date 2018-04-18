import * as Router from 'koa-router'
import {placementController, PlacementUpdate} from '../controllers/placement'
import {placementValidator} from '../validators/placement'
import validate = require('koa-joi-validate')

// include in /project/:projectId/...
export const placementRouter = new Router()
    .prefix('/project/:projectId/placement')
    .use(async (ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        return next()
    })
    .post('/',
        validate(placementValidator.create),
        async ctx => {
            const placements: string[] = ctx.request.body
            const projectId = parseInt(ctx.params.projectId, 10)

            await placementController.create(ctx, ctx.state.user!, projectId, placements)
        })
    .put('/',
        validate(placementValidator.update),
        async ctx => {
            const placementUpdates: PlacementUpdate[] = ctx.request.body
            const projectId = parseInt(ctx.params.projectId, 10)

            await placementController.update(ctx, ctx.state.user!, projectId, placementUpdates)
        })
    .delete('/',
        validate(placementValidator.delete),
        async ctx => {
            const placements: number[] = ctx.request.body
            const projectId = parseInt(ctx.params.projectId, 10)

            await placementController.delete(ctx, ctx.state.user!, projectId, placements)
        })
