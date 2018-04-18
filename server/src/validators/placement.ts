import {joiEntityId, joiEntityIdAsString} from './common'
import * as joi from 'joi'

const commonPart = {
    params: {
        projectId: joiEntityIdAsString,
    }
}

const maxPlacements = 40

const placementName = joi.string().max(50)

export const placementValidator = {
    create: {
        body: joi.array().max(maxPlacements).items(placementName),
        ...commonPart,
    },
    update: {
        body: joi.array().max(maxPlacements).items(joi.object().keys({
            accept: joiEntityId,
            decline: joi.array().max(200).items(joiEntityId),
            name: placementName,
            id: joiEntityId.required(),
        })),
        ...commonPart,
    },
    delete: {
        body: joi.array().max(maxPlacements).items(joiEntityId),
        ...commonPart,
    }
}
