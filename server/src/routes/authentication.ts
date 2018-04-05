import * as Router from 'koa-router'
import koaPassport = require('koa-passport')

export const authenticationRouter = new Router()
    .prefix('/authentication')
    .post('/local', koaPassport.authenticate('local'))
    .get('/logout', ctx => ctx.logout())
