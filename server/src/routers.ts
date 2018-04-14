import * as Router from 'koa-router'
import {authenticationRouter} from './routes/authentication'
import {userRouter} from './routes/user'
import {projectRouter} from './routes/project'
import {participationRouter} from './routes/participation'
import {placementRouter} from './routes/placement'

export const router = new Router()
    .use(authenticationRouter.routes(), authenticationRouter.allowedMethods())
    .use(userRouter.routes(), userRouter.allowedMethods())
    .use(projectRouter.routes(), projectRouter.allowedMethods())
    .use(participationRouter.routes(), participationRouter.allowedMethods())
    .use(placementRouter.routes(), placementRouter.allowedMethods())
