import supertest = require('supertest')
import {app} from '../app'

test('not authenticated', async () => {
    const agent = supertest.agent(app.callback())
    await agent.post('/participation')
        .expect(401)

    await agent.delete('/participation/1')
        .expect(401)
})

test('create participation', async () => {
    // TODO
})
