import 'reflect-metadata'

import {createConnection, getConnection, getRepository} from 'typeorm'
import {User} from '../entity/User'
import {hash} from 'bcryptjs'

// uniqueness in test
let usersCounter = 0

const RUNNER_ID = process.env.JEST_WORKER_ID

export function getNewUser() {
    usersCounter++
    const username = `user_${usersCounter}_${RUNNER_ID}`
    return {
        username,
        password: 'password_' + Math.random() * 1000,
    }
}

export async function getAndInsertNewUser() {
    const user = {
        ...getNewUser(),
        email: `test@email.com.${usersCounter}.${RUNNER_ID}`,
        body: 'body_' + Math.random() + 'a'
    }

    await getRepository(User).insert({
        ...user,
        password: await hash(user.password, 12)
    })

    return user
}

beforeAll(async () => {
    await createConnection()
})

afterAll(async () => {
    await getConnection().close()
})
