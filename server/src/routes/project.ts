import * as Router from 'koa-router'
import {getRepository} from 'typeorm'
import {Project} from '../entity/Project'
import {Placement} from '../entity/Placement'
import {User} from '../entity/User'

export const projectRouter = new Router()
    .prefix('/project')
    .get('/', ctx => {
        const {from = 0, limit = 10} = ctx.request.query
        return getRepository(Project)
            .find({take: limit, skip: from})
    })
    .get('/:id', ctx => {
        const id = ctx.params.id
        return getRepository(Project)
            .findOneById(id)
    })
    .post('/', ctx => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        const {header, text, placements} = ctx.body
        const user = ctx.session as any as User
        const project = new Project()
        project.header = header
        project.text = text
        project.creator = user
        project.placements = (placements || []).map((name: string): Placement => {
            const placement = new Placement()
            placement.name = name
            return placement
        })

        return getRepository(Project)
            .save(project)
    })
    .put('/:id', async ctx => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        const {header, text, addPlacements = [], removePlacements = []}: {
            header?: string,
            text?: string,
            addPlacements: string[], // ids
            removePlacements: number[],
            assignUsers: string[],
        } = ctx.body

        const user = ctx.session as any as User
        const projectRepository = getRepository(Project)
        const project = await projectRepository
            .findOneById(ctx.params.id)

        if (!project) {
            return ctx.throw(400, 'no such project')
        }

        if (user.username !== project.creator.username) {
            return ctx.throw(403, 'not creator of project')
        }
        project.header = header === undefined ? project.header : header
        project.text = text === undefined ? project.text : text
        project.placements = project.placements
            .filter(placement => removePlacements.includes(placement.id))
            .concat(addPlacements.map(name => {
                const placement = new Placement()
                placement.name = name
                return placement
            }))

        await projectRepository.save(project)
    })
    .delete('/:id', async ctx => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        const user = ctx.session as any as User
        const projectsRepository = getRepository(Project)
        const project = await projectsRepository
            .findOneById(ctx.params.id)

        if (!project) {
            return ctx.throw(400, 'no such project')
        }

        if (user.username !== project.creator.username) {
            return ctx.throw(403, 'not creator of project')
        }

        await projectsRepository.deleteById(project.id)
    })
