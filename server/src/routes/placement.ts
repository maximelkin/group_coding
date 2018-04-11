import * as Router from 'koa-router'
import {placementController, PlacementUpdate} from '../controllers/placement'
import {commonValidator} from '../validators/common'
import {placementValidator} from '../validators/placement'

// include in /project/:projectId/...
export const placementRouter = new Router()
    .prefix('/placement')
    .post('/', async ctx => {
        const placements: string[] = ctx.request.body
        const projectId = parseInt(ctx.params.projectId, 10)

        ctx.assert(commonValidator.nonNegativeNumber(projectId), 400, 'wrong project id')
        ctx.assert(placementValidator.placementsLength(placements), 400, 'wrong placements array')

        await placementController.create(ctx, ctx.state.user!, projectId, placements)
    })
    .put('/', async ctx => {
        const placementUpdates: PlacementUpdate[] = ctx.request.body

        const projectId = parseInt(ctx.params.projectId, 10)

        ctx.assert(commonValidator.nonNegativeNumber(projectId), 400, 'wrong project id')
        ctx.assert(placementValidator.placementsLength(placementUpdates), 400, 'wrong placements array')

        await placementController.update(ctx, ctx.state.user, projectId, placementUpdates)
    })
    .delete('/', async ctx => {
        const placements: number[] = ctx.request.body
        const projectId = parseInt(ctx.params.projectId, 10)

        ctx.assert(commonValidator.nonNegativeNumber(projectId), 400, 'wrong project id')
        ctx.assert(placementValidator.placementsLength(placements), 400, 'wrong placements array')

        await placementController.delete(ctx, projectId, placements)
    })
