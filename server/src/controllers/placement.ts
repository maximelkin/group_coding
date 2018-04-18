import {Context} from 'koa'
import {getManager, getRepository} from 'typeorm'
import {Project} from '../entity/Project'
import {Placement} from '../entity/Placement'
import {User} from '../entity/User'
import {ParticipationRequest} from '../entity/ParticipationRequest'

export interface PlacementUpdate {
    accept?: number     // id of participationRequest
    decline?: number[]  // ids of participationRequests
    name?: string
    id: number          // placement id
}

export const placementController = {
    async create(ctx: Context, user: User, projectId: number, placements: string[]) {
        const projectRepository = getRepository(Project)

        const project = await projectRepository
            .findOneById(projectId, {
                relations: ['placements']
            })
        if (!project) {
            return ctx.throw(404)
        }

        if (project.creatorUsername !== user.username) {
            return ctx.throw(403, 'not a project manager')
        }

        project.placements.push(...placements.map(name => {
            const placement = new Placement()
            placement.name = name
            placement.project = project
            return placement
        }))

        await projectRepository.save(project)

        ctx.status = 200
    },

    async update(ctx: Context, user: User, projectId: number, placementUpdates: PlacementUpdate[]) {
        const placementRepository = getRepository(Placement)

        const placements: Placement[] = []
        for (const {id, name, accept, decline} of placementUpdates) {

            if (!name && !accept && (!decline || decline.length === 0)) {
                continue
            }

            let relations
            if (accept || decline && decline.length > 0) {
                relations = ['participationRequests', 'participationRequests.user']
            }
            const placement = await placementRepository
                .findOneById(id, {
                    relations
                })

            if (!placement) {
                return ctx.throw(404, `no such placement: ${id}`)
            }

            if (!placement || placement.projectId !== projectId) {
                return ctx.throw(403, `no rights to edit: ${id}`)
            }

            if (name) {
                placement.name = name
            }

            if (accept) {
                const foundParticipationRequest = placement.participationRequests.find(
                    request => request.id === accept
                )
                if (foundParticipationRequest) {
                    placement.user = foundParticipationRequest.user
                }
            }

            if (decline && decline.length > 0) {
                for (const toBeDeclined of decline) {
                    const foundParticipationRequest = placement.participationRequests.find(
                        request => request.id === toBeDeclined
                    )

                    if (foundParticipationRequest) {
                        foundParticipationRequest.declined = true
                    }
                }
            }
            placements.push(placement)
        }
        if (placements.length > 0) {
            await placementRepository.save(placements)
        }

        ctx.status = 200
    },
    async delete(ctx: Context, user: User, projectId: number, placements: number[]) {
        const projectRepository = getRepository(Project)

        const project = await projectRepository
            .findOneById(projectId, {
                relations: ['placements', 'placements.participationRequests']
            })

        if (!project) {
            return ctx.throw(404)
        }

        if (project.creatorUsername !== user.username) {
            return ctx.throw(403, 'not project manager')
        }

        const placementsForRemove = project
            .placements
            .filter(placement => placements.includes(placement.id))

        await getManager()
            .transaction(async entityManger => {
                for (const {participationRequests} of placementsForRemove) {
                    await entityManger.getRepository(ParticipationRequest)
                        .remove(participationRequests)
                }

                await entityManger.getRepository(Placement)
                    .remove(placementsForRemove)
            })
        ctx.status = 200
    }
}
