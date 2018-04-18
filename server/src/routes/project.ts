import * as Router from 'koa-router'
import {projectController} from '../controllers/project'
import {projectValidator} from '../validators/project'
import {commonValidator} from '../validators/common'

const authenticatedProjectRouter = new Router()
    .use((ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        return next()
    })
    .post('/', async ctx => {
        const {header, text} = ctx.request.body

        ctx.assert(projectValidator.header(header), 400, 'wrong new header')
        ctx.assert(projectValidator.text(text), 400, 'wrong new text')

        await projectController.create(ctx, ctx.state.user!, {header, text})
    })
    .put('/:projectId', async ctx => {
        const {header, text}: {
            header?: string,
            text?: string,
        } = ctx.request.body

        const user = ctx.state.user!
        const projectId = parseInt(ctx.params.projectId, 10)

        ctx.assert(commonValidator.nonNegativeNumber(projectId), 400, 'wrong project id')

        ctx.assert(!header || projectValidator.header(header), 400, 'wrong new header')
        ctx.assert(!text || projectValidator.text(text), 400, 'wrong new text')

        await projectController.update(ctx, user, projectId, {header, text})
    })
    .delete('/:projectId', async ctx => {
        const projectId = parseInt(ctx.params.projectId, 10)

        ctx.assert(commonValidator.nonNegativeNumber(projectId), 400, 'wrong project id')

        await projectController.delete(ctx, ctx.state.user!, projectId)
    })

export const projectRouter = new Router()
    .prefix('/project')
    .get('/', async ctx => {
        let {from, limit} = ctx.request.query
        from = from && parseInt(from, 10) || 0
        limit = limit && parseInt(limit, 10) || 10

        ctx.assert.equal(typeof from, 'number', 400)
        ctx.assert.equal(typeof limit, 'number', 400)
        ctx.assert(limit <= 1000, 400, 'too big limit')

        await projectController.readMany(ctx, {from, limit})
    })
    .get('/:projectId', async ctx => {
        const projectId = parseInt(ctx.params.projectId, 10)

        ctx.assert(commonValidator.nonNegativeNumber(projectId), 400, 'wrong project id')

        await projectController.read(ctx, ctx.state.user!, projectId)
    })
    .use(authenticatedProjectRouter.routes(), authenticatedProjectRouter.allowedMethods())
