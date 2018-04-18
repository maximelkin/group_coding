import {getRepository} from 'typeorm'
import {Placement} from '../entity/Placement'
import {ParticipationRequest} from '../entity/ParticipationRequest'
import {User} from '../entity/User'
import {Context} from 'koa'

export const participationController = {

    async create(ctx: Context, placementId: number, user: User) {

        const placement = await getRepository(Placement)
            .findOneById(placementId)

        if (!placement) {
            return ctx.throw(404, `placement not found: ${placementId}`)
        }

        const participationRequest = new ParticipationRequest()
        participationRequest.user = user
        participationRequest.placement = placement

        const saved = await getRepository(ParticipationRequest)
            .save(participationRequest)

        ctx.body = saved.id
    },

    async delete(ctx: Context, participationRequestId: number, user: User) {
        const participationRequest = await getRepository(ParticipationRequest)
            .findOneById(participationRequestId)

        if (!participationRequest) {
            return ctx.throw(404)
        }

        if (participationRequest.username !== user.username) {
            return ctx.throw(403, 'wrong user')
        }

        await getRepository(ParticipationRequest)
            .remove(participationRequest)

        ctx.status = 200
    }
}
