import * as Router from 'koa-router'
import {userController} from '../controllers/user'
import {userValidator} from '../validators/user'

export const userRouter = new Router()
    .prefix('/user')
    .get('/:username', async ctx => {
        const {username} = ctx.params

        ctx.assert(userValidator.username(username), 400, 'wrong username')

        await userController.read(ctx, ctx.state.user!, username)
    })
    .post('/', async ctx => {
        const {username, password} = ctx.request.body

        ctx.assert(userValidator.username(username), 400, 'wrong username')
        ctx.assert(userValidator.password(password), 400, 'wrong password')

        await userController.create(ctx, username, password)
    })
    .use(async (ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        await next()
    })
    .put('/', async ctx => {
        const {password, body, email} = ctx.request.body

        ctx.assert(!password || userValidator.password(password), 400, 'wrong new password')
        ctx.assert(!body || userValidator.body(body), 400, 'wrong new body')
        ctx.assert(!email || userValidator.email(email), 400, 'wrong new email')

        await userController.update(ctx, ctx.state.user!, {password, body, email})
    })
