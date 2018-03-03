import {Column, Entity, PrimaryColumn, OneToMany, ManyToMany} from 'typeorm'
import {Project} from './Project'

@Entity()
export class User {

    @PrimaryColumn()
    public username: string

    @Column()
    public body: string

    @Column()
    public password: string

    @OneToMany(() => Project, project => project.creator)
    public createdProjects: Project[]

    @ManyToMany(() => Project, project => project.participants)
    public projects: Project[]
}
