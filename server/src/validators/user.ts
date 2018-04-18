import * as joi from 'joi'

const usernameRe = /^[a-z\d_\-]{1,12}$/

const joiUsername = joi.string().regex(usernameRe)

const password = joi.string().min(3).max(50)
export const userValidator = {
    read: {
        params: joi.object({
            username: joiUsername.required(),
        }),
    },
    create: {
        body: joi.object({
            username: joiUsername.required(),
            password: password.required(),
        }),
    },
    update: {
        body: joi.object({
            password,
            body: joi.string().max(5000),
            email: joi.string().email()
        }),
    },
}
