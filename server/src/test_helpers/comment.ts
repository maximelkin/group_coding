import {Project} from '../entity/Project'
import {User} from '../entity/User'
import {getRepository} from 'typeorm'
import {Comment} from '../entity/Comment'

export function getNewCommentStub(): { message: string} {
    return {
        message: 'message' + Math.random(),
    }
}

export async function getAndInsertNewComment(user: User, project: Project, parentCommentId?: number) {
    const commentStub: Partial<Comment> = {
        author: user,
        project,
        ...getNewCommentStub(),
    }
    if (parentCommentId) {
        commentStub.parentCommentId = parentCommentId
    }
    const commentRepository = getRepository(Comment)
    return (await commentRepository.save(commentStub)) as Comment
}
