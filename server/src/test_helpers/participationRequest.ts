import {Placement} from '../entity/Placement'
import {getRepository} from 'typeorm'
import {User} from '../entity/User'
import {ParticipationRequest} from '../entity/ParticipationRequest'

export async function getAndInsertNewParticipationRequest(placement: Placement, issuer: User) {
    const request = {
        placement,
        user: issuer,
    }
    const placementRepository = getRepository(ParticipationRequest)
    return (await placementRepository.save(request)) as ParticipationRequest
}
