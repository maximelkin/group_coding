import * as Router from 'koa-router'
import {userController} from '../controllers/user'
import {userValidator} from '../validators/user'

export const userRouter = new Router()
    .prefix('/user')
    .get('/:username', async ctx => {
        const {username} = ctx.params

        ctx.assert(userValidator.username(username), 400, 'wrong username')

        await userController.read(ctx, ctx.session, username)
    })
    .post('/', async ctx => {
        const {username, password} = ctx.request.body

        ctx.assert(userValidator.username(username), 400, 'wrong username')
        ctx.assert(userValidator.password(password), 400, 'wrong password')

        await userController.create(ctx, username, password)
    })
    .use((ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        return next()
    })
    .put('/', async ctx => {
        const {password, body} = ctx.request.body

        ctx.assert(!password || userValidator.password(password), 400, 'wrong new password')
        ctx.assert(!body || userValidator.body(body), 400, 'wrong new body')

        await userController.update(ctx, ctx.session!, {password, body})
    })
