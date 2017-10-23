import {Service} from 'typedi'
import {Get, JsonController} from 'routing-controllers'
import {OrmRepository} from 'typeorm-typedi-extensions'
import {Tag} from '../entity/Tag'
import {Repository} from 'typeorm'

// TODO maybe stats by each tag
@Service()
@JsonController('/tags')
export class TagController {
    @OrmRepository(Tag)
    private repository: Repository<Tag>

    @Get()
    public getAll() {
        return this.repository.find()
    }
}
