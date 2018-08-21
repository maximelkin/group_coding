import Koa = require('koa')
import koaPassport = require('koa-passport')
import bodyParser = require('koa-bodyparser')
import session = require('koa-session')
import logger = require('koa-logger')
import {router} from './routers'

import './authentication' // init passport

export const app = new Koa()

app.keys = [process.env.SECRET]
app
    .use(logger())
    .use(bodyParser())
    .use(session(app))
    .use(koaPassport.initialize())
    .use(koaPassport.session())
    .use(router.routes())
    .use(router.allowedMethods())
