import '../helpers/testHelper'
import request = require('supertest')
import {app} from '../app'
import {getRepository} from 'typeorm'
import {User} from '../entity/User'
import {compare} from 'bcryptjs'

test('create user', async () => {
    await request.agent(app.callback())
        .post('/user')
        .type('json')
        .send({
            username: 'aaa',
            password: 'bbb',
        })
        .expect(200)
})

test('read user', async () => {
    await request.agent(app.callback())
        .get('/user/pre_created')
        .expect(200, {
            username: 'pre_created',
            body: '',
            createdProjects: [],
            placements: [],
        })
})

test('read user authenticated', async () => {
    const agent = request.agent(app.callback())

    const res = await agent
        .post('/authentication/local')
        .type('json')
        .send({
            username: 'pre_created',
            password: 'password'
        })
        .expect(200)
    // @ts-ignore
    const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    const cookie = cookies.join(';')

    await request.agent(app.callback())
        .get('/user/pre_created')
        .set('Cookie', cookie)
        .expect(200, {
            username: 'pre_created',
            body: '',
            createdProjects: [],
            placements: [],
            email: null,
            participationRequests: [],
        })
})

test('update user', async () => {
    const agent = request.agent(app.callback())

    const res = await agent
        .post('/authentication/local')
        .type('json')
        .send({
            username: 'pre_created',
            password: 'password'
        })
        .expect(200)
    // @ts-ignore
    const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    const cookie = cookies.join(';')

    await agent
        .put('/user/')
        .type('json')
        .set('Cookie', cookie)
        .send({
            password: 'bbb',
            email: 'test@a',
            body: 'non-empty'
        })
        .expect(200)

    const user = await getRepository(User)
        .findOneById('pre_created')

    if (!user) {
        return expect(user).toBeTruthy()
    }

    const {password, ...restUser} = user

    expect(await compare('bbb', password)).toEqual(true)
    expect(restUser).toEqual(expect.objectContaining({
        email: 'test@a',
        body: 'non-empty',
        username: 'pre_created',
    }))
})
