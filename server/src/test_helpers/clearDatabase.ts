import 'reflect-metadata'
import {createConnection} from 'typeorm'

export default async () => {
    const connection = await createConnection()
    await connection.dropDatabase()
    await connection.synchronize() // i don't know why but it fix tests
    await connection.close()
}
