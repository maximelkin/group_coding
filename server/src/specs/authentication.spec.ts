import '../test_helpers/testHelper'
import {getAndInsertNewUser, getNewUser} from '../test_helpers/user'

import supertest = require('supertest')
import {app} from '../app'
import {getCookies} from '../test_helpers/authentication'

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
    await getCookies(agent, user)

    await agent
        .get(`/authentication/test`)
        .expect(200)
})

test('logout', async () => {
    await supertest.agent(app.callback())
        .get('/authentication/logout')
        .expect(200)
        .expect('set-cookie', /koa:sess/)
        .expect('set-cookie', /koa:sess\.sig/)
})
