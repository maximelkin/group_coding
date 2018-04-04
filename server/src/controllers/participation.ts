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
            return ctx.throw(400, 'placement not found')
        }

        const participationRequest = new ParticipationRequest()
        participationRequest.user = user
        participationRequest.placement = placement

        await getRepository(ParticipationRequest)
            .save(participationRequest)
    },

    async delete(ctx: Context, participationRequestId: number, user: User) {
        const participationRequest = await getRepository(ParticipationRequest)
            .findOneById(participationRequestId)

        if (!participationRequest) {
            return ctx.throw(404)
        }

        if (participationRequest.user.username !== user.username) {
            return ctx.throw(403, 'wrong user')
        }

        await getRepository(ParticipationRequest)
            .remove(participationRequest)
    }
}
