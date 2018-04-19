import * as joi from 'joi'

export const joiEntityId = joi.number().min(0)
export const joiEntityIdAsString = joi.string().regex(/^\d{1,8}$/)
export const joiPagination = {
    limit: joi.string().regex(/^\d{1,3}$/),
    offset: joi.string().regex(/^\d{1,8}$/),
}

const usernameRe = /^[a-z\d_\-]{1,12}$/

export const joiUsername = joi.string().regex(usernameRe)
