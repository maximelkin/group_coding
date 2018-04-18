declare module '*.json' {
    const t: any
    export = t
}

declare module 'koa-joi-validate' {
    import koa = require('koa')

    function validate(schema: { headers?: any, query?: any, params?: any, body?: any }): koa.Middleware

    export = validate
}
