'use strict'
import 'reflect-metadata' // for typeorm and routing

import * as path from 'path'
import * as jwt from 'jsonwebtoken'
import {Action, createExpressServer, useContainer as routingUseContainer} from 'routing-controllers'
import {createConnection, getConnectionManager, useContainer as ormUseContainer} from 'typeorm'
import {Container} from 'typedi'
import {User} from './entity/User'
import * as morgan from 'morgan'
import * as express from 'express'
import bodyParser = require('body-parser')
import * as debug from 'debug'

const config = require('../config.json')

routingUseContainer(Container)
ormUseContainer(Container)

createConnection()
    .catch(err => console.error(err))

const app: express.Express = createExpressServer({
    routePrefix: '/api',
    middlewares: [
        morgan('dev'),
        express.static(path.join('..', 'build/')),
        bodyParser.json(),
        bodyParser.urlencoded({extended: false})
    ],
    controllers: [path.join(__dirname, '/controllers', '/*.js')],
    currentUserChecker: async (action: Action) => {
        // here you can use request/response objects from action
        // you need to provide a user object that will be injected in controller actions
        const token = action.request.headers.authorization
        try {
            return new Promise((resolve, reject) => {
                jwt.verify(token, config.token, {},
                    (err: Error, decoded) => {
                        if (err) {
                            debug('app').log(err)
                            return reject(err)
                        }
                        resolve(decoded)
                    })
            }).then((decoded: { username: string }) => {
                return getConnectionManager()
                    .get()
                    .getRepository(User)
                    .findOneById(decoded.username)
            })

        } catch (e) {

            return null
        }
    }
})

app.listen(3000)
