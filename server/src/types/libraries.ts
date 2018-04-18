declare module '*.json' {
    const t: any
    export = t
}
declare interface Blob {}
declare interface XMLHttpRequest {}

declare module 'koa-joi-validate' {
    import koa = require('koa')

    function validate(schema: { headers?: any, query?: any, params?: any, body?: any }): koa.Middleware

    export = validate
}
