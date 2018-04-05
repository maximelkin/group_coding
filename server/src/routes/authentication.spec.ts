import 'ts-jest'
import request = require('supertest')
import {app} from '../app'

test('authentication', async () => {
    await request(app.callback())
        .post('/authentication/local')
        .field({
            username: 'not_existing',
            password: 'fake'
        })
        .expect(400)
})
