import * as joi from 'joi'
import {joiEntityId, joiEntityIdAsString, joiUsername} from './common'

export const commentValidator = {
    readByProject: {
        params: joi.object({
            projectId: joiEntityIdAsString
        })
    },
    readByUser: {
        params: joi.object({
            username: joiUsername
        })
    },
    create: {
        params: joi.object({
            projectId: joiEntityIdAsString
        }),
        body: joi.object({
            message: joi.string().max(3000),
            parentCommentId: joiEntityId,
        })
    }
}
