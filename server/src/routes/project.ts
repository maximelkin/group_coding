import * as Router from 'koa-router'
import {projectController} from '../controllers/project'
import {projectValidator} from '../validators/project'
import {validateMiddleware} from '../helpers'

const authenticatedProjectRouter = new Router()
    .use((ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        return next()
    })
    .post('/',
        validateMiddleware(projectValidator.create),
        async ctx => {
            const {header, text} = ctx.request.body as any

            await projectController.create(ctx, ctx.state.user!, {header, text})
        })
    .put('/:projectId',
        validateMiddleware(projectValidator.update),
        async ctx => {
            const {header, text}: {
                header?: string,
                text?: string,
            } = ctx.request.body

            const user = ctx.state.user!
            const projectId = parseInt(ctx.params.projectId, 10)

            await projectController.update(ctx, user, projectId, {header, text})
        })
    .delete('/:projectId',
        validateMiddleware(projectValidator.delete),
        async ctx => {
            const projectId = parseInt(ctx.params.projectId, 10)

            await projectController.delete(ctx, ctx.state.user!, projectId)
        })

export const projectRouter = new Router()
    .prefix('/project')
    .get('/',
        validateMiddleware(projectValidator.readMany),
        async ctx => {
            let {offset, limit} = ctx.request.query
            offset = offset && parseInt(offset, 10) || 0
            limit = limit && parseInt(limit, 10) || 10

            await projectController.readMany(ctx, {offset, limit})
        })
    .get('/:projectId',
        validateMiddleware(projectValidator.readOne),
        async ctx => {
            const projectId = parseInt(ctx.params.projectId, 10)

            await projectController.read(ctx, ctx.state.user!, projectId)
        })
    .use(authenticatedProjectRouter.routes(), authenticatedProjectRouter.allowedMethods())
