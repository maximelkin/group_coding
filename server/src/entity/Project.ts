import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from 'typeorm'
import {User} from './User'
import {Tag} from './Tag'

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public header: string

    @Column({type: 'text'})
    public text: string

    @ManyToOne(() => User, creator => creator.createdProjects)
    public creator: User

    @ManyToMany(() => User, user => user.projects)
    @JoinTable()
    public participants: User[]

    @ManyToMany(() => Tag, tag => tag.projects)
    @JoinTable({
        name: 'projectsTags',
        joinColumn: {
            name: 'projectId'
        },
        inverseJoinColumn: {
            name: 'tagName'
        }
    })
    public tags: Tag[]
}
