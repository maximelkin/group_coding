import * as Router from 'koa-router'
import {searchController} from '../controllers/search'
import {searchValidator} from '../validators/search'
import validate = require('koa-joi-validate')

export const searchRouter = new Router()
    .prefix('/search')
    .get('/placements',
        validate(searchValidator.placements),
        async ctx => {
            // tslint:disable
            let {limit, offset, direction, ...conditions} = ctx.query
            // tslint:enable

            limit = limit ? parseInt(limit, 10) : 10
            offset = offset ? parseInt(offset, 10) : 0
            await searchController.placements(ctx, conditions, {limit, offset, direction})
        })
