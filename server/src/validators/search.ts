import * as joi from 'joi'
import {joiPagination} from './common'

const validSides = ['browser', 'backend', 'desktop', 'ios', 'android', 'native', 'any']

function arrayOrSingle(d: joi.SchemaLike) {
    return [joi.array().max(10).items(d), d]
}

export const searchValidator = {
    placements: {
        query: joi.object().keys({
            side: arrayOrSingle(joi.string().allow(validSides)),
            language: arrayOrSingle(joi.string().max(20)),
            framework: arrayOrSingle(joi.string().max(20)),
            direction: joi.string().allow('ASC', 'DESC'),
            ...joiPagination,
        }),
    }
}
