import * as Router from 'koa-router'
import {authenticationRouter} from './routes/authentication'
import {userRouter} from './routes/user'
import {projectRouter} from './routes/project'

export const router = new Router()
    .use(authenticationRouter.routes(), authenticationRouter.allowedMethods())
    .use(userRouter.routes(), userRouter.allowedMethods())
    .use(projectRouter.routes(), projectRouter.allowedMethods())
