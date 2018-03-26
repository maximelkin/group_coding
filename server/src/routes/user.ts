import * as Router from 'koa-router'
import {getRepository} from 'typeorm'
import {User} from '../entity/User'
import {hash} from 'bcryptjs'
import {Placement} from '../entity/Placement'
import {ParticipationRequest} from '../entity/ParticipationRequest'

const authenticatedUserRouter = new Router()
    .use('/*', async (ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        return next()
    })
    .put('/', async ctx => {
        const {password, body} = ctx.request.body
        const hashed = password ? await hash(password, 12) : password

        // ctx.session exists because isAuthenticated === true
        await getRepository(User)
            .updateById(ctx.session!.username, {
                body,
                password: hashed,
            })
    })
    .post('/participate/:id', async ctx => {
        const {placementId} = ctx.params
        const placement = await getRepository(Placement)
            .findOneById(placementId)

        if (!placement) {
            return ctx.throw(400, 'no such placement')
        }

        const user = ctx.session as any as User

        const participationRequest = new ParticipationRequest()
        participationRequest.user = user
        participationRequest.placement = placement

        return getRepository(ParticipationRequest)
            .save(participationRequest)
    })
    .delete('/participate/:id', async ctx => {
        const participationRequest = await getRepository(ParticipationRequest)
            .findOneById(ctx.params.id)

        if (!participationRequest) {
            return ctx.throw(400, 'no such participation request')
        }

        // ctx.session is not undefined because previously we checked what user authenticated
        if (participationRequest.user.username !== ctx.session!.username) {
            return ctx.throw(403, 'wrong user')
        }
        await getRepository(ParticipationRequest)
            .remove(participationRequest)
    })

export const userRouter = new Router()
    .prefix('/user')
    .get('/:username', async ctx => {
        ctx.body = await getRepository(User)
            .findOneById(ctx.params.username, {
                select: ['username', 'body', 'createdProjects', 'placements', 'participationRequests'],
                relations: ['createdProjects', 'placements', 'participationRequests']
            })
    })
    .post('/', async ctx => {
        const {username, password} = ctx.body
        const hashedPassword = await hash(password, 12)
        await getRepository(User)
            .insert({username, password: hashedPassword})
    })
    .use(authenticatedUserRouter.routes(), authenticatedUserRouter.allowedMethods())
