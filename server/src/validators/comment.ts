import * as joi from 'joi'
import {joiEntityId, joiEntityIdAsString, joiPagination, joiUsername} from './common'

export const commentValidator = {
    readByProject: {
        params: joi.object({
            projectId: joiEntityIdAsString.required()
        })
    },
    readByUser: {
        params: joi.object({
            username: joiUsername.required(),
        }),
        query: joi.object(joiPagination),
    },
    create: {
        params: joi.object({
            projectId: joiEntityIdAsString.required()
        }),
        body: joi.object({
            message: joi.string().max(3000).required(),
            parentCommentId: [joiEntityId, null],
        })
    }
}
