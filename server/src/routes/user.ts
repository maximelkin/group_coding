import * as Router from 'koa-router'
import {userController} from '../controllers/user'
import {userValidator} from '../validators/user'
import {validateMiddleware} from '../helpers'

export const userRouter = new Router()
    .prefix('/user')
    .get('/:username',
        validateMiddleware(userValidator.read),
        async ctx => {
            const {username} = ctx.params

            await userController.read(ctx, ctx.state.user, username)
        })
    .post('/',
        validateMiddleware(userValidator.create),
        async ctx => {
            const {username, password} = ctx.request.body as any

            await userController.create(ctx, username, password)
        })
    .use(async (ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        await next()
    })
    .put('/',
        validateMiddleware(userValidator.update),

        async ctx => {
            const {password, body, email} = ctx.request.body as any

            await userController.update(ctx, ctx.state.user!, {password, body, email})
        }
    )
