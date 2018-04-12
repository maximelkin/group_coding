import {Context} from 'koa'
import {hash} from 'bcryptjs'
import {User} from '../entity/User'
import {getRepository} from 'typeorm'

export const userController = { // за проезд передаем!
    async create(ctx: Context, username: string, password: string) {
        const hashedPassword = await hash(password, 12)
        await getRepository(User)
            .insert({
                username,
                password: hashedPassword,
                body: '',
            })
        ctx.status = 200
    },

    async read(ctx: Context, currentUser: User | undefined, username: string) {
        const relations = ['createdProjects', 'placements']
        const selectColumns: Array<keyof User> = [
            'username',
            'body',
        ]

        if (currentUser && currentUser.username === username) {
            relations.push('participationRequests')
            selectColumns.push('email')
        }

        ctx.body = await getRepository(User)
            .findOneById(username, {
                select: selectColumns,
                relations
            })
    },

    async update(ctx: Context, user: User, {password, body, email}: {
        password?: string, body?: string, email: string
    }) {

        const hashed = password ? await hash(password, 12) : password

        await getRepository(User)
            .update({username: user.username}, {
                body,
                password: hashed,
                email,
            })
        ctx.status = 200
    },
}
