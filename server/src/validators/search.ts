import * as joi from 'joi'

const validSides = ['browser', 'backend', 'desktop', 'ios', 'android', 'native', 'any']

function arrayOrSingle(d: joi.SchemaLike) {
    return [joi.array().max(10).items(d), d]
}

export const searchValidator = {
    placements: joi.object().keys({
        side: arrayOrSingle(joi.string().allow(validSides)),
        language: arrayOrSingle(joi.string().max(20)),
        framework: arrayOrSingle(joi.string().max(20)),
        limit: joi.string().regex(/^\d{1,3}$/),
        offset: joi.string().regex(/^\d{1,3}$/),
        direction: joi.string().allow('ASC', 'DESC')
    }),
}
