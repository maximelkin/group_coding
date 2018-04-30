import '../test_helpers/testHelper'
import supertest = require('supertest')
import {app} from '../app'
import {getRepository} from 'typeorm'
import {User} from '../entity/User'
import {compare} from 'bcryptjs'
import {getAndInsertNewUser, getNewUser} from '../test_helpers/user'
import {getCookies} from '../test_helpers/authentication'

test('create user', async () => {
    const user = getNewUser()
    await supertest.agent(app.callback())
        .post('/user')
        .type('json')
        .send({
            username: user.username,
            password: user.password,
        })
        .expect(200)
})

test('create duplicate user', async () => {
    const user = await getAndInsertNewUser()

    await supertest.agent(app.callback())
        .post('/user')
        .type('json')
        .send({
            username: user.username,
            password: user.password,
        })
        .expect(400)
})

test('read user', async () => {
    const user = await getAndInsertNewUser()
    await supertest.agent(app.callback())
        .get(`/user/${user.username}`)
        .expect(200, {
            username: user.username,
            body: user.body,
            createdProjects: [],
            placements: [],
        })
})

test('read user authenticated', async () => {
    const user = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())

    const cookie = await getCookies(agent, user)

    await supertest.agent(app.callback())
        .get(`/user/${user.username}`)
        .set('Cookie', cookie)
        .expect(200, {
            username: user.username,
            body: user.body,
            createdProjects: [],
            placements: [],
            email: user.email,
            participationRequests: [],
        })
})

test('update user without credentials', async () => {
    await supertest.agent(app.callback())
        .put('/user/')
        .type('json')
        .send({
            email: 'ra@emial.aaa',
            body: 'test',
        })
        .expect(401)
})

test('update user', async () => {
    const user = await getAndInsertNewUser()

    const agent = supertest.agent(app.callback())

    const cookie = await getCookies(agent, user)

    await agent
        .put('/user/')
        .type('json')
        .set('Cookie', cookie)
        .send({
            password: user.password + '_1',
            email: 'ra@emial.aaa',
            body: 'test',
        })
        .expect(200)

    const userAfterUpdate = await getRepository(User)
        .findOne(user.username)

    if (!userAfterUpdate) {
        return expect(userAfterUpdate).toBeTruthy()
    }

    const {password, ...restUser} = userAfterUpdate

    expect(await compare(user.password + '_1', password)).toEqual(true)
    expect(restUser).toEqual(expect.objectContaining({
        email: 'ra@emial.aaa',
        body: 'test',
        username: user.username,
    }))
})
