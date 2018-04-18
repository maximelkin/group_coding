import '../test_helpers/testHelper'
import {getAndInsertNewUser} from '../test_helpers/user'
import {getAndInsertNewProject, getNewProjectStub} from '../test_helpers/project'
import supertest = require('supertest')
import {app} from '../app'
import {getCookies} from '../test_helpers/authentication'
import {getRepository} from 'typeorm'
import {Project} from '../entity/Project'

test('get projects', async () => {
    const user = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())
    const {creator, ...project} = await getAndInsertNewProject(user)
    const projects = JSON.parse((await agent.get('/project?limit=1000')).text)
    expect(projects).toContainEqual({
        ...project,
        creatorUsername: creator.username,
    })
})

test('get project', async () => {
    const user = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())
    const {creator, ...project} = await getAndInsertNewProject(user)
    await agent.get(`/project/${project.id}`)
        .expect(200, {
            ...project,
            placements: [],
            creatorUsername: creator.username,
        })
})

test('create project non authorized', async () => {
    const agent = supertest.agent(app.callback())
    await agent.post('/project')
        .expect(401)
})

test('create project', async () => {
    const user = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())
    const cookie = await getCookies(agent, user)

    const projectStub = getNewProjectStub()

    await agent.post('/project')
        .set('Cookie', cookie)
        .send(projectStub)
        .expect(200)
        .expect(/^\d+$/)
})

test('update project non authorized', async () => {
    const user = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())

    const projectBefore = await getAndInsertNewProject(user)

    const projectUpdate = getNewProjectStub()

    await agent.put(`/project/${projectBefore.id}`)
        .send(projectUpdate)
        .expect(401)
})

test('update project', async () => {
    const user = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())
    const cookie = await getCookies(agent, user)

    const projectBefore = await getAndInsertNewProject(user)

    const projectUpdate = getNewProjectStub()

    await agent.put(`/project/${projectBefore.id}`)
        .set('Cookie', cookie)
        .send(projectUpdate)
        .expect(200)

    const updatedProject = await getRepository(Project).findOneById(projectBefore.id)
    expect(updatedProject).toEqual({
        ...projectUpdate,
        id: projectBefore.id,
        creatorUsername: projectBefore.creator.username,
    })
})

test('delete project not authorized', async () => {
    const user = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())

    const projectBefore = await getAndInsertNewProject(user)

    await agent.delete(`/project/${projectBefore.id}`)
        .expect(401)
})

test('delete project', async () => {
    const user = await getAndInsertNewUser()
    const agent = supertest.agent(app.callback())
    const cookie = await getCookies(agent, user)

    const projectBefore = await getAndInsertNewProject(user)

    await agent.delete(`/project/${projectBefore.id}`)
        .set('Cookie', cookie)
        .expect(200)

    const updatedProject = await getRepository(Project).findOneById(projectBefore.id)
    expect(updatedProject).toBeUndefined()
})
