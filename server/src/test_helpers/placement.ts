import {Placement} from '../entity/Placement'
import {getRepository} from 'typeorm'
import {Project} from '../entity/Project'

export function getNewPlacementStub() {
    return {
        name: 'placement_name' + Math.random(),
    }
}

export async function getAndInsertNewPlacement(project: Project) {
    const placementStub = {
        project,
        ...getNewPlacementStub(),
    }
    const placementRepository = getRepository(Placement)
    return (await placementRepository.save(placementStub)) as Placement
}
