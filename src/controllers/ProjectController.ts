import {
    Param, Get, Post, Put, BodyParam, CurrentUser, JsonController, ForbiddenError,
    NotFoundError, Delete, QueryParams
} from 'routing-controllers'
import {OrmConnection, OrmRepository} from 'typeorm-typedi-extensions'
import {Connection, Repository} from 'typeorm'
import {Project} from '../entity/Project'
import {User} from '../entity/User'
import {Service} from 'typedi'
import {Tag} from '../entity/Tag'

@Service()
@JsonController('/project')
export class UserController {

    @OrmRepository(Project)
    private repository: Repository<Project>

    @OrmConnection()
    private connection: Connection

    @Get()
    public getAll(@QueryParams() params: {
        limit?: number,
        from?: number,
        tags?: string[],
    }) {
        const {from = 0, limit = 10, tags} = params
        if (!tags) {
            return this.repository.find({take: limit, skip: from})
        }

        return this.connection.createQueryBuilder('projectsTags', 'projectsTags')
            .select('project.*')
            .innerJoin('Project', 'project', 'project.id = projectsTags.projectId')
            .where('projectsTags.tagName IN :values', tags)
            .groupBy('project.projectId')
            .limit(limit)
            .skip(from)
            .execute()

    }

    @Get('/:id')
    public getOne(@Param('id') id: number) {
        return this.repository.findOneById(id)
    }

    @Post()
    public create(@BodyParam('header', {required: true}) header: string,
                  @BodyParam('text', {required: true}) text: string,
                  @BodyParam('tags', {required: true}) tags: string[],
                  @CurrentUser({required: true}) user: User) {

        return this.repository.save({
            ...new Project(),
            header,
            text,
            creator: user,
            tags: tags.map(tag => ({
                ...new Tag(),
                name: tag
            }))
        })
    }

    @Put('/:id')
    public async update(@Param('id') id: string,
                        @BodyParam('header') header: string,
                        @BodyParam('text') text: string,
                        @BodyParam('tags') tags: string[],
                        @CurrentUser({required: true}) user: User) {
        const project = await this.repository.findOneById(id)

        if (!project) {
            throw new NotFoundError('project not found')
        }

        if (project.creator.username !== user.username) {
            throw new ForbiddenError('not creator of project')
        }

        return this.repository.save({
            id: project.id,
            header,
            text,
            tags: tags.map(tag => ({
                ...new Tag(),
                name: tag
            }))
        })
    }

    @Delete('/:id')
    public async remove(@Param('id') id: string,
                        @CurrentUser({required: true}) user: User) {
        const project = await this.repository.findOneById(id)

        if (!project) {
            throw new NotFoundError('project not found')
        }

        if (project.creator.username !== user.username) {
            throw new ForbiddenError('not creator of project')
        }

        return this.repository.deleteById(project.id)
    }

}
