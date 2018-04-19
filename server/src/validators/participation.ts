import * as joi from 'joi'
import {joiEntityIdAsString} from './common'

export const participationValidator = {
    create: {
        params: joi.object({
            placementId: joiEntityIdAsString,
        }),
    },
    delete: {
        params: joi.object({
            id: joiEntityIdAsString,
        }),
    }
}
