import * as joi from 'joi'
import {joiEntityId, joiEntityIdAsString} from './common'

export const participationValidator = {
    create: {
        body: joi.object({
            placementId: joiEntityId,
        }),
    },
    delete: {
        params: joi.object({
            id: joiEntityIdAsString,
        }),
    }
}
