import {hash} from 'bcryptjs'
import {User} from '../entity/User'
import {getRepository} from 'typeorm'

let usersCounter = 0
// uniqueness in test
const RUNNER_ID = process.env.JEST_WORKER_ID

export function getNewUser() {
    usersCounter++
    const username = `u_${usersCounter}_${RUNNER_ID}_${Date.now() % 1000000}`
    return {
        username,
        password: 'password_' + Math.random() * 1000,
    }
}

export async function getAndInsertNewUser(): Promise<User> {
    const user = {
        ...getNewUser(),
        email: `test@email.com.${usersCounter}.${RUNNER_ID}`,
        body: 'body_' + Math.random() + 'a'
    }

    const userRepository = getRepository(User)

    await userRepository.insert({
        ...user,
        password: await hash(user.password, 12)
    })
    const foundUser = (await userRepository.findOne(user.username))!
    foundUser.password = user.password
    return foundUser
}
