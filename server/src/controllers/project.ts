import {getRepository} from 'typeorm'
import {Project} from '../entity/Project'
import {User} from '../entity/User'
import {Context} from 'koa'

export const projectController = {
    async create(ctx: Context, user: User, {header, text}: {header: string, text: string}) {
        const project = new Project()
        project.header = header
        project.text = text
        project.creator = user

        const projectSaved = await getRepository(Project)
            .save(project)
        ctx.body = projectSaved.id
    },

    async read(ctx: Context, user: User | undefined, projectId: number) {
        const projectRepository = getRepository(Project)

        let project = await projectRepository.findOneById(projectId, {
            relations: ['placements']
        })

        if (!project) {
            return ctx.throw(404)
        }

        if (user && project.creatorId === user.username) {
            // if project creator - add participation requests
            project = await projectRepository.findOneById(projectId, {
                relations: ['placements', 'placements.participationRequests']
            })
        }
        ctx.body = project
    },

    async update(ctx: Context, user: User, projectId: number, {header, text}: {header?: string, text?: string}) {
        const projectRepository = getRepository(Project)
        const project = await projectRepository
            .findOneById(projectId)

        if (!project) {
            return ctx.throw(404)
        }

        if (user.username !== project.creator.username) {
            return ctx.throw(403, 'not creator of project')
        }
        project.header = header === undefined ? project.header : header
        project.text = text === undefined ? project.text : text

        await projectRepository.save(project)
    },

    async delete(ctx: Context, user: User, projectId: number) {
        const projectsRepository = getRepository(Project)
        const project = await projectsRepository
            .findOneById(projectId)

        if (!project) {
            return ctx.throw(404)
        }

        if (user.username !== project.creator.username) {
            return ctx.throw(403, 'not creator of project')
        }

        await projectsRepository.deleteById(project.id)
    }
}
