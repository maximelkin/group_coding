import '../test_helpers/testHelper'

import {getAndInsertNewUser} from '../test_helpers/user'
import {getAndInsertNewProject} from '../test_helpers/project'
import {getAndInsertNewComment, getNewCommentStub} from '../test_helpers/comment'
import {app} from '../app'
import supertest = require('supertest')
import {Comment} from '../entity/Comment'
import {getCookies} from '../test_helpers/authentication'
import {getRepository} from 'typeorm'

function fixComment(comment: Comment) {
    comment.projectId = comment.project.id
    comment.username = comment.author.username
    delete comment.project
    delete comment.author
}

test('read comments for project', async () => {
    const creator = await getAndInsertNewUser()
    const commentator = await getAndInsertNewUser()
    const project = await getAndInsertNewProject(creator)
    const comment1 = await getAndInsertNewComment(commentator, project)
    const comment2 = await getAndInsertNewComment(commentator, project, comment1.id)
    const comment3 = await getAndInsertNewComment(commentator, project, comment2.id)
    fixComment(comment1)
    fixComment(comment2)
    fixComment(comment3)

    const agent = supertest.agent(app.callback())

    const {text} = await agent.get(`/comment/project/${project.id}`)
        .expect(200)

    expect(JSON.parse(text))
        .toEqual([{
            ...comment1,
            children: [
                {
                    ...comment2,
                    children: [{
                        ...comment3,
                        children: [],
                    }]
                }
            ]
        }])
})

test('read comments for user', async () => {
    const creator = await getAndInsertNewUser()
    const commentator = await getAndInsertNewUser()
    const project = await getAndInsertNewProject(creator)
    const comment1 = await getAndInsertNewComment(commentator, project)
    const comment2 = await getAndInsertNewComment(commentator, project, comment1.id)
    const comment3 = await getAndInsertNewComment(commentator, project, comment2.id)
    const comments = [comment1, comment2, comment3]
    comments.forEach(fixComment)
    const agent = supertest.agent(app.callback())

    const {text} = await agent.get(`/comment/user/${commentator.username}`)
        .expect(200)

    expect(new Set(JSON.parse(text)))
        .toEqual(new Set(comments))
})

test('create comment', async () => {
    const creator = await getAndInsertNewUser()
    const commentator = await getAndInsertNewUser()
    const project = await getAndInsertNewProject(creator)
    const comment1 = await getAndInsertNewComment(commentator, project)

    fixComment(comment1)

    const commentStub = getNewCommentStub()

    const agent = supertest.agent(app.callback())

    const cookie = await getCookies(agent, commentator)

    const {text} = await agent.post(`/comment/project/${project.id}`)
        .set('Cookie', cookie)
        .send({
            ...commentStub,
            parentCommentId: comment1.id,
        })
        .expect(200)

    const newId = JSON.parse(text)
    const createdComment = await getRepository(Comment).findOneById(newId)

    expect(createdComment)
        .toEqual({
            ...commentStub,
            id: newId,
            username: commentator.username,
            projectId: project.id,
            parentCommentId: comment1.id,
        })
})
