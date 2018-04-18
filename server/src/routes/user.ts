import * as Router from 'koa-router'
import {userController} from '../controllers/user'
import {userValidator} from '../validators/user'
import validate = require('koa-joi-validate')

export const userRouter = new Router()
    .prefix('/user')
    .get('/:username',
        validate(userValidator.read),
        async ctx => {
            const {username} = ctx.params

            await userController.read(ctx, ctx.state.user!, username)
        })
    .post('/',
        validate(userValidator.create),
        async ctx => {
            const {username, password} = ctx.request.body

            await userController.create(ctx, username, password)
        })
    .use(async (ctx, next) => {
        if (!ctx.isAuthenticated()) {
            return ctx.throw(401)
        }
        await next()
    })
    .put('/',
        validate(userValidator.update),

        async ctx => {
            const {password, body, email} = ctx.request.body

            await userController.update(ctx, ctx.state.user!, {password, body, email})
        }
    )
