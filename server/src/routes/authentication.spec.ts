import '../helpers/testHelper'

import request = require('supertest')
import {app} from '../app'

test('authentication with not existing user', async () => {
    await request.agent(app.callback())
        .post('/authentication/local')
        .type('json')
        .send({
            username: 'not_existing',
            password: 'fake'
        })
        .expect(401)
})

test('authentication with existing user', async () => {
    const agent = request.agent(app.callback())

    const res = await agent
        .post('/authentication/local')
        .type('json')
        .send({
            username: 'pre_created',
            password: 'password'
        })
        .expect('set-cookie', /koa:sess/)
        .expect('set-cookie', /koa:sess\.sig/)
        .expect(200)
    // @ts-ignore
    const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    const cookie = cookies.join(';')

    await agent
        .get(`/authentication/test`)
        .set('Cookie', cookie)
        .expect(200)
})

test('logout', async () => {
    await request.agent(app.callback())
        .get('/authentication/logout')
        .expect(200)
})
