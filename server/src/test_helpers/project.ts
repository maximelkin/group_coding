import {User} from '../entity/User'
import {Project} from '../entity/Project'
import {getRepository} from 'typeorm'

export function getNewProjectStub() {
    return {
        header: 'header_' + Math.random(),
        text: 'really big text' + Math.random(),
    }
}

export async function getAndInsertNewProject(creator: User) {
    const projectStub = {
        creator,
        ...getNewProjectStub(),
    }
    const projectRepository = getRepository(Project)
    return (await projectRepository.save(projectStub)) as Project
}
