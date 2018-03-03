import 'reflect-metadata'
import * as path from 'path'
import * as jwt from 'jsonwebtoken'
import {Action, createExpressServer, useContainer as routingUseContainer} from 'routing-controllers'
import {createConnection, getRepository, useContainer as ormUseContainer} from 'typeorm'
import {Container} from 'typedi'
import {User} from './entity/User'
import * as morgan from 'morgan'
import * as express from 'express'
import bodyParser = require('body-parser')
import * as debug from 'debug'
import config = require('../config.json')
import Bluebird = require('bluebird')

routingUseContainer(Container)
ormUseContainer(Container)

const jwtVerify = Bluebird.promisify(jwt.verify, {context: jwt})

createConnection()
    .catch(err => console.error(err))

const app: express.Express = createExpressServer({
    routePrefix: '/api',
    middlewares: [
        morgan('dev'),
        bodyParser.json(),
        bodyParser.urlencoded({extended: false})
    ],
    controllers: [path.join(__dirname, '/controllers', '/*.js')],
    currentUserChecker: async (action: Action) => {
        // here you can use request/response objects from action
        // you need to provide a user object that will be injected in controller actions
        const token = action.request.headers.authorization
        const decoded = await jwtVerify(token, config.token) as any
        if (typeof decoded === 'string' || !decoded.username) {
            debug('app').log('JWT STOLEN')
            throw new Error('wrong jwt')
        }

        return getRepository(User)
            .findOneById(decoded.username)
    }
})

app.listen(3000)
