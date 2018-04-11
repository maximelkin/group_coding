import * as Router from 'koa-router'
import koaPassport = require('koa-passport')

export const authenticationRouter = new Router()
    .prefix('/authentication')
    .post('/local', async (ctx, next) => {
        ctx.status = 200
        return koaPassport.authenticate('local')(ctx, next)
    })
    .get('/test', async ctx => {
        if (ctx.isUnauthenticated() || !ctx.session) {
            return ctx.throw(401)
        }
        ctx.status = 200
    })
    .get('/logout', ctx => {
        ctx.logout()
        ctx.status = 200
    })
