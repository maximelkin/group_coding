import * as Router from 'koa-router'
import {getRepository} from 'typeorm'
import {Placement} from '../entity/Placement'
import {Project} from '../entity/Project'

// enable in /project/:projectId/...
export const placementRouter = new Router()
    .prefix('/placement')
    .post('/', async ctx => {
        const placements: string[] = ctx.request.body
        const {projectId} = ctx.params

        if (placements.length === 0 || placements.length > 50) {
            return ctx.throw(400)
        }

        const projectRepository = getRepository(Project)

        const project = await projectRepository
            .findOneById(projectId, {
                relations: ['placements']
            })
        if (!project) {
            return ctx.throw(404)
        }

        if (project.creatorId !== ctx.session!.username) {
            return ctx.throw(403, 'not a project manager')
        }

        project.placements.push(...placements.map(name => {
            const placement = new Placement()
            placement.name = name
            placement.project = project
            return placement
        }))

        if (project.placements.length > 50) {
            return ctx.throw(400)
        }

        await projectRepository.save(project)

    })
    .put('/', async ctx => {
        const placementUpdates: Array<{
            accept?: number     // id of participationRequest
            decline?: number[]  // ids of participationRequests
            name?: string
            id: number          // placement id
        }>
            = ctx.request.body

        const {projectId} = ctx.params

        if (placementUpdates.length === 0 || placementUpdates.length > 50) {
            return ctx.throw(400)
        }
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

            if (!placement || placement.projectId !== projectId) {
                continue
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
    })
    .delete('/', async ctx => {
        const placements: number[] = ctx.request.body
        const {projectId} = ctx.params

        if (placements.length === 0 || placements.length > 50) {
            return ctx.throw(400)
        }

        const projectRepository = getRepository(Project)
        const placementRepository = getRepository(Placement)

        const project = await projectRepository
            .findOneById(projectId, {
                relations: ['placements']
            })

        if (!project) {
            return ctx.throw(404)
        }

        if (project.creatorId !== ctx.session!.username) {
            return ctx.throw(403, 'not project manager')
        }

        const placementsForRemove = project
            .placements
            .filter(placement => placements.includes(placement.id))

        await placementRepository.remove(placementsForRemove)
    })
