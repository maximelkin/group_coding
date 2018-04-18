import 'reflect-metadata'

import Koa = require('koa')
import koaPassport = require('koa-passport')
import bodyParser = require('koa-bodyparser')
import session = require('koa-session')
import logger = require('koa-logger')
import config = require('../config.json')
import {router} from './routers'

import './authentication' // init passport

export const app = new Koa()

app.keys = [config.token]
app
    .use(logger())
    .use(bodyParser())
    .use(session(app))
    .use(koaPassport.initialize())
    .use(koaPassport.session())
    .use(router.routes())
    .use(router.allowedMethods())
