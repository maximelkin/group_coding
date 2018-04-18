import * as joi from 'joi'
import {joiEntityId, joiPagination} from './common'

const maxHeaderLength = 100
const maxTextLength = 5000

const header = joi.string().max(maxHeaderLength)
const text = joi.string().max(maxTextLength)

export const projectValidator = {
    readMany: {
        query: joiPagination,
    },
    readOne: {
        params: joi.object({
            projectId: joiEntityId,
        })
    },
    create: {
        body: joi.object({
            header: header.required(),
            text: text.required(),
        })
    },
    update: {
        body: joi.object({
            header,
            text,
        }),
        params: joi.object({
            projectId: joiEntityId,
        }),
    },
    delete: {
        params: joi.object({
            projectId: joiEntityId,
        }),
    }
}
