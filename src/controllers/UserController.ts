import {Param, Get, Post, Put, BodyParam, CurrentUser, JsonController, BadRequestError} from 'routing-controllers'
import {OrmRepository} from 'typeorm-typedi-extensions'
import {User} from '../entity/User'
import {Repository} from 'typeorm'
import {compare, hash} from 'bcryptjs'
import {Service} from 'typedi'
import {sign} from 'jsonwebtoken'

const config = require('../../config.json')

@Service()
@JsonController('/users')
export class UserController {

    @OrmRepository(User)
    private repository: Repository<User>

    @Post('/auth')
    public auth(@BodyParam('username', {required: true}) username: string,
                @BodyParam('password', {required: true}) password: string) {
        return this.repository.findOneById(username)
            .then(user => user !== undefined
                && compare(password, user.password))
            .then(result => {
                if (!result) {
                    throw new BadRequestError('check failed')
                }
                return result
            })
            .then(result => new Promise((resolve, reject) =>
                sign({username}, config.token, {}, (err: Error, token) => {
                    if (err) {
                        return reject(err)
                    }
                    resolve(token)
                })
            ))
    }

    @Get()
    public getAll() {
        return this.repository.find()
    }

    @Get('/:username')
    public getOne(@Param('username') username: number) {
        return this.repository.findOneById(username)
    }

    @Post()
    public create(@BodyParam('username', {required: true}) username: string,
                  @BodyParam('password', {required: true}) password: string) {

        return hash(password, 12)
            .then(hashed => {
                return this.repository.insert({username, password: hashed})
            })
    }

    @Put()
    public async update(@CurrentUser({required: true}) user: User,
                        @BodyParam('body') body: string | undefined,
                        @BodyParam('password') password?: string | undefined) {
        const hashed = password ? await hash(password, 12) : password

        return this.repository.updateById(user.username, {password: hashed, body})
    }

}
