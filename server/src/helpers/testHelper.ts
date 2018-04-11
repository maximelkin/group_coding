import 'reflect-metadata'

import {Connection, createConnection, getRepository} from 'typeorm'
import {User} from '../entity/User'
import {hash} from 'bcryptjs'

let connection: Connection
let hashedPassword: string

beforeAll(async () => {
    hashedPassword = await hash('password', 12)
    connection = await createConnection()
})

beforeEach(async () => {
    await connection.dropDatabase()
    await connection.synchronize()

    await getRepository(User)
        .insert({
            username: 'pre_created',
            password: hashedPassword,
            body: '',
        })
})

afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
})
