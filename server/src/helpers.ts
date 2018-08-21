import {ObjectSchema, ValidationOptions, validate, ArraySchema} from 'joi'
import {Middleware} from 'koa'

type Schema = ObjectSchema | ArraySchema

// taken from koa-joi-validate
// maintainer not support his package so i extract this
function validateObject(object: any = {}, label: string, schema: Schema, options?: ValidationOptions) {
    // Skip validation if no ObjectSchema is provided
    if (schema) {
        // Validate the object against the provided ObjectSchema
        const {error} = validate(object, schema, options)
        if (error) {
            // Throw error with custom message if validation failed
            throw new Error(`Invalid ${label} - ${error.message}`)
        }
    }
}

export function validateMiddleware({headers, body, params, query}: {
    headers?: Schema,
    query?: Schema,
    params?: Schema,
    body?: Schema
}): Middleware {
    // Return a Koa middleware function
    return (ctx, next) => {
        try {
            // Validate each request data object in the Koa context object
            validateObject(ctx.headers, 'Headers', headers, {allowUnknown: true})
            validateObject(ctx.params, 'URL Parameters', params, {})
            validateObject(ctx.query, 'URL Query', query, {})

            validateObject(ctx.request.body, 'Request Body', body, {})

            return next()
        } catch (err) {
            console.error(err)
            // If any of the objects fails validation, send an HTTP 400 response.
            ctx.throw(400, err.message)
        }
    }

}
