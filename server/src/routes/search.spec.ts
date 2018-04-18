import '../test_helpers/testHelper'
import supertest = require('supertest')
import {app} from '../app'
import {getAndInsertNewProject} from '../test_helpers/project'
import {getAndInsertNewUser} from '../test_helpers/user'
import {getAndInsertNewPlacement} from '../test_helpers/placement'
import {getRepository} from 'typeorm'
import {Placement} from '../entity/Placement'

test('should search', async () => {
    const creator = await getAndInsertNewUser()

    const agent = supertest.agent(app.callback())

    const project = await getAndInsertNewProject(creator)
    const placement1 = await getAndInsertNewPlacement(project)
    const placement2 = await getAndInsertNewPlacement(project)

    placement1.framework = 'angular'
    placement2.framework = 'react'  // not a framework, lel

    await getRepository(Placement)
        .save([placement1, placement2])

    const a = await agent.get('/search/placements')
        .query({
            framework: ['angular'],
        })
        .expect(200)

    expect(JSON.parse(a.text)).toEqual([{
        side: null,
        language: null,
        framework: 'angular',
        id: placement1.id,
        name: placement1.name,
        username: null,
        projectId: project.id,
    }])
})
