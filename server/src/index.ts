import Koa = require('koa')
import koaPassport = require('koa-passport')
import bodyParser = require('koa-bodyparser')
import session = require('koa-session')
import config = require('../config.json')
import {router} from './routers'

const app = new Koa()

app.keys = [config.token]
app
    .use(bodyParser())
    .use(session(app))
    .use(koaPassport.initialize())
    .use(koaPassport.session())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(process.env.PORT || 8080)
