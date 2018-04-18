import '../test_helpers/testHelper'
import supertest = require('supertest')
import {app} from '../app'
import {getAndInsertNewUser} from '../test_helpers/user'
import {getCookies} from '../test_helpers/authentication'
import {getAndInsertNewProject} from '../test_helpers/project'
import {getRepository} from 'typeorm'
import {Project} from '../entity/Project'
import {getAndInsertNewPlacement} from '../test_helpers/placement'
import {getAndInsertNewParticipationRequest} from '../test_helpers/participationRequest'
import {User} from '../entity/User'

test('not authenticated', async () => {
    const agent = supertest.agent(app.callback())
    await agent.post('/project/1/placement')
        .expect(401)

    await agent.put('/project/1/placement')
        .expect(401)

    await agent.delete('/project/1/placement')
        .expect(401)
})

test('create placement', async () => {
    const creator = await getAndInsertNewUser()

    const agent = supertest.agent(app.callback())
    const cookie = await getCookies(agent, creator)

    const project = await getAndInsertNewProject(creator)

    await agent.post(`/project/${project.id}/placement`)
        .send([
            'aaa',
            'bbb',
        ])
        .set('Cookie', cookie)
        .expect(200)

    const projectAfterInsert = await getRepository(Project)
        .findOneById(project.id, {relations: ['placements']})

    expect(projectAfterInsert).toBeTruthy()

    expect(new Set(projectAfterInsert!.placements))
        .toEqual(new Set([
            {
                id: expect.anything(),
                name: 'aaa',
                username: null,
                side: null,
                language: null,
                framework: null,
                projectId: project.id,
            },
            {
                id: expect.anything(),
                name: 'bbb',
                username: null,
                side: null,
                language: null,
                framework: null,
                projectId: project.id,
            },
        ]))
})

test('update placements', async () => {

    const creator = await getAndInsertNewUser()

    const simpleUser = await getAndInsertNewUser()

    const agent = supertest.agent(app.callback())
    const cookie = await getCookies(agent, creator)

    const project = await getAndInsertNewProject(creator)
    const placement1 = await getAndInsertNewPlacement(project)
    const placement2 = await getAndInsertNewPlacement(project)
    const placement3 = await getAndInsertNewPlacement(project)

    const placement1Request = await getAndInsertNewParticipationRequest(placement1, simpleUser)
    const placement2Request = await getAndInsertNewParticipationRequest(placement2, simpleUser)
    const placement3Request = await getAndInsertNewParticipationRequest(placement3, simpleUser)

    await agent.put(`/project/${project.id}/placement`)
        .send([
            {
                id: placement1.id,
                name: 'new_name'
            },
            {
                id: placement2.id,
                accept: placement2Request.id,
            },
            {
                id: placement3.id,
                decline: [placement3Request.id],
            },
        ])
        .set('Cookie', cookie)
        .expect(200)

    const projectAfterInsert = await getRepository(Project)
        .findOneById(project.id, {relations: ['placements', 'placements.participationRequests']})

    if (!projectAfterInsert) {
        return expect(projectAfterInsert).toBeTruthy()
    }
    expect(projectAfterInsert.placements).toHaveLength(3)

    expect(projectAfterInsert.placements)
        .toContainEqual({
            id: placement1.id,
            username: null,
            side: null,
            language: null,
            framework: null,
            projectId: project.id,
            name: 'new_name',
            participationRequests: [{
                id: placement1Request.id,
                username: simpleUser.username,
                declined: false,
                placementId: placement1.id,
            }],
        })

    expect(projectAfterInsert.placements)
        .toContainEqual({
            id: placement2.id,
            username: simpleUser.username,
            side: null,
            language: null,
            framework: null,
            projectId: project.id,
            name: placement2.name,
            participationRequests: [{
                id: placement2Request.id,
                username: simpleUser.username,
                declined: false,
                placementId: placement2.id,
            }],
        })

    expect(projectAfterInsert.placements)
        .toContainEqual({
            id: placement3.id,
            username: null,
            side: null,
            language: null,
            framework: null,
            projectId: project.id,
            name: placement3.name,
            participationRequests: [{
                id: placement3Request.id,
                username: simpleUser.username,
                declined: true,
                placementId: placement3.id,
            }],
        })
})

test('delete placements', async () => {
    const creator = await getAndInsertNewUser()

    const simpleUser = await getAndInsertNewUser()

    const agent = supertest.agent(app.callback())
    const cookie = await getCookies(agent, creator)

    const project = await getAndInsertNewProject(creator)
    const placement1 = await getAndInsertNewPlacement(project)
    const placement2 = await getAndInsertNewPlacement(project)

    const placement1Request = await getAndInsertNewParticipationRequest(placement1, simpleUser)
    await getAndInsertNewParticipationRequest(placement2, simpleUser)

    await agent.delete(`/project/${project.id}/placement`)
        .send([
            placement2.id // delete placement, not request!
        ])
        .set('Cookie', cookie)
        .expect(200)

    const simpleUserAfter = await getRepository(User).findOneById(simpleUser.username, {
        relations: ['participationRequests']
    })

    const projectAfterInsert = await getRepository(Project)
        .findOneById(project.id, {relations: ['placements', 'placements.participationRequests']})

    if (!projectAfterInsert) {
        return expect(projectAfterInsert).toBeTruthy()
    }

    expect(projectAfterInsert.placements).toEqual([{
        id: placement1.id,
        username: null,
        side: null,
        language: null,
        framework: null,
        projectId: project.id,
        name: placement1.name,
        participationRequests: [{
            id: placement1Request.id,
            username: simpleUser.username,
            declined: false,
            placementId: placement1.id,
        }],
    }])

    if (!simpleUserAfter) {
        return expect(simpleUserAfter).toBeTruthy()
    }

    expect(simpleUserAfter.participationRequests).toEqual([{
        id: placement1Request.id,
        placementId: placement1.id,
        username: simpleUserAfter.username,
        declined: false,
    }])
})
