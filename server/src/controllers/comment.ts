import {Context} from 'koa'
import {getRepository} from 'typeorm'
import {Comment} from '../entity/Comment'
import {User} from '../entity/User'

interface ExtendedComment extends Comment {
    children: ExtendedComment[]
}

export const commentController = {
    async readByProject(ctx: Context, projectId: number) {
        const commentRepository = getRepository(Comment)
        const comments = await commentRepository.find({
            where: {
                projectId,
            },
        })

        const commentsMap = new Map(comments
            .map((comment): [number, ExtendedComment] =>
                [
                    comment.id,
                    {
                        ...comment,
                        children: [],
                    }
                ]))

        const commentsRoots: ExtendedComment[] = []

        commentsMap.forEach(comment => {
            if (comment.parentCommentId !== null) {
                commentsMap
                    .get(comment.parentCommentId)!
                    .children.push(comment)
            } else {
                commentsRoots.push(comment)
            }
        })

        ctx.body = commentsRoots
    },

    async readByUser(ctx: Context, username: string, {limit, offset}: { limit: number, offset: number }) {
        const commentRepository = getRepository(Comment)
        ctx.body = await commentRepository.find({
            where: {
                username,
            },
            skip: offset,
            take: limit,
        })
    },

    async create(ctx: Context, user: User, projectId: number, {message, parentCommentId}: {
        message: string,
        parentCommentId: number,
    }) {
        const commentRepository = getRepository(Comment)

        const count = await commentRepository.count({
            where: {
                projectId,
            }
        })

        if (count > 400) {
            return ctx.throw(400, 'too many comments')
        }

        const comment = await commentRepository.save({
            username: user.username,
            projectId,
            message,
            parentCommentId
        }) as Comment
        ctx.body = comment.id
    },
}
