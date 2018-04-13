import '../test_helpers/testHelper'
import {getAndInsertNewUser, getNewUser} from '../test_helpers/user'

import supertest = require('supertest')
import {app} from '../app'

test('authentication with not existing user', async () => {
    const user = getNewUser() // not existing yet!
    await supertest.agent(app.callback())
        .post('/authentication/local')
        .type('json')
        .send({
            username: user.username,
            password: user.password,
        })
        .expect(401)
})

test('authentication with existing user', async () => {
    const agent = supertest.agent(app.callback())
    const user = await getAndInsertNewUser() // existing
    const res = await agent
        .post('/authentication/local')
        .type('json')
        .send({
            username: user.username,
            password: user.password,
        })
        .expect('set-cookie', /koa:sess/)
        .expect('set-cookie', /koa:sess\.sig/)
        .expect(200)

    // dirty hack for jest
    // @ts-ignore
    const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    const cookie = cookies.join(';')

    await agent
        .get(`/authentication/test`)
        .set('Cookie', cookie)
        .expect(200)
})

test('logout', async () => {
    await supertest.agent(app.callback())
        .get('/authentication/logout')
        .expect(200)
        .expect('set-cookie', /koa:sess/)
        .expect('set-cookie', /koa:sess\.sig/)
})
