import {Context} from 'koa'
import {hash} from 'bcryptjs'
import {User} from '../entity/User'
import {getRepository} from 'typeorm'

export const userController = { // за проезд передаем!
    async create(ctx: Context, username: string, password: string) {
        const hashedPassword = await hash(password, 12)
        await getRepository(User)
            .insert({username, password: hashedPassword})

    },

    async read(ctx: Context, currentUser: User | undefined, username: string) {
        const relations = ['createdProjects', 'placements']
        const selectColumns: Array<keyof User> = [
            'username',
            'body',
            'createdProjects',
            'placements'
        ]

        if (currentUser && currentUser.username === username) {
            relations.push('participationRequests')
            selectColumns.push('participationRequests', 'email')
        }

        ctx.body = await getRepository(User)
            .findOneById(username, {
                select: selectColumns,
                relations
            })
    },

    async update(ctx: Context, user: User, {password, body}: { password?: string, body?: string }) {
        const hashed = password ? await hash(password, 12) : password

        await getRepository(User)
            .updateById(user.username, {
                body,
                password: hashed,
            })
    },
}
