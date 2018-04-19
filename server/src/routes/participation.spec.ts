import '../test_helpers/testHelper'
import supertest = require('supertest')
import {app} from '../app'
import {getAndInsertNewUser} from '../test_helpers/user'
import {getCookies} from '../test_helpers/authentication'
import {getAndInsertNewProject} from '../test_helpers/project'
import {getAndInsertNewPlacement} from '../test_helpers/placement'
import {getRepository} from 'typeorm'
import {ParticipationRequest} from '../entity/ParticipationRequest'
import {getAndInsertNewParticipationRequest} from '../test_helpers/participationRequest'

test('not authenticated', async () => {
    const agent = supertest.agent(app.callback())
    await agent.post('/participation/placement/1')
        .expect(401)

    await agent.delete('/participation/1')
        .expect(401)
})

test('create participation', async () => {
    const user = await getAndInsertNewUser()
    const creator = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())
    const cookie = await getCookies(agent, user)

    const project = await getAndInsertNewProject(creator)
    const placement = await getAndInsertNewPlacement(project)
    const response = await agent.post(`/participation/placement/${placement.id}`)
        .set('Cookie', cookie)
        .expect(200)

    const participationId = parseInt(response.text, 10)
    const participationRequest = await getRepository(ParticipationRequest)
        .findOneById(participationId)

    expect(participationRequest).toEqual({
        id: participationId,
        username: user.username,
        placementId: placement.id,
        declined: false,
    })
}, 10000)

test('delete participation', async () => {
    const user = await getAndInsertNewUser()
    const creator = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())
    const cookie = await getCookies(agent, user)

    const project = await getAndInsertNewProject(creator)
    const placement = await getAndInsertNewPlacement(project)

    const participationRequest = await getAndInsertNewParticipationRequest(placement, user)

    await agent.delete(`/participation/${participationRequest.id}`)
        .set('Cookie', cookie)
        .expect(200)

    expect(await getRepository(ParticipationRequest)
        .findOneById(participationRequest.id)).toBeUndefined()
})
