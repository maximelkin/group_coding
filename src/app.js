'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path = require("path");
const jwt = require("jsonwebtoken");
const routing_controllers_1 = require("routing-controllers");
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
const User_1 = require("./entity/User");
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const debug = require("debug");
const config = require('../config.json');
routing_controllers_1.useContainer(typedi_1.Container);
typeorm_1.useContainer(typedi_1.Container);
typeorm_1.createConnection()
    .catch(err => console.error(err));
const app = routing_controllers_1.createExpressServer({
    routePrefix: '/api',
    middlewares: [
        morgan('dev'),
        express.static(path.join('..', 'build/')),
        bodyParser.json(),
        bodyParser.urlencoded({ extended: false })
    ],
    controllers: [path.join(__dirname, '/controllers', '/*.js')],
    currentUserChecker: async (action) => {
        const token = action.request.headers.authorization;
        try {
            return new Promise((resolve, reject) => {
                jwt.verify(token, config.token, {}, (err, decoded) => {
                    if (err) {
                        debug('app').log(err);
                        return reject(err);
                    }
                    resolve(decoded);
                });
            }).then((decoded) => {
                return typeorm_1.getConnectionManager()
                    .get()
                    .getRepository(User_1.User)
                    .findOneById(decoded.username);
            });
        }
        catch (e) {
            return null;
        }
    }
});
app.listen(3000);
