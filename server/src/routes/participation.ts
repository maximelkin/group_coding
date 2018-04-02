import * as Router from 'koa-router'
import {ParticipationRequest} from '../entity/ParticipationRequest'
import {getRepository} from 'typeorm'
import {Placement} from '../entity/Placement'
import {User} from '../entity/User'

export const participationRouter = new Router()
    .prefix('/participation')
    .use((ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        return next()
    })
    .post('/', async ctx => {
        const {placementId} = ctx.request.body

        ctx.assert.notEqual(typeof placementId, 'object', 400)

        const placement = await getRepository(Placement)
            .findOneById(placementId)

        if (!placement) {
            return ctx.throw(404)
        }

        const user = ctx.session as any as User

        const participationRequest = new ParticipationRequest()
        participationRequest.user = user
        participationRequest.placement = placement

        return getRepository(ParticipationRequest)
            .save(participationRequest)
    })
    .delete('/:id', async ctx => {

        const participationRequest = await getRepository(ParticipationRequest)
            .findOneById(ctx.params.id)

        if (!participationRequest) {
            return ctx.throw(404)
        }

        if (participationRequest.user.username !== ctx.session!.username) {
            return ctx.throw(403, 'wrong user')
        }

        await getRepository(ParticipationRequest)
            .remove(participationRequest)
    })
