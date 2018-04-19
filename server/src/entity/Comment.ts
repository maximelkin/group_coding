import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {Project} from './Project'
import {User} from './User'

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    public id: number

    @Column('text')
    public message: string

    @Column()
    public username: string

    @Column()
    public projectId: number

    @Column({
        nullable: true,
    })
    public parentCommentId: number

    @ManyToOne(() => User, user => user.placements)
    @JoinColumn({name: 'username'})
    public author: User

    @ManyToOne(() => Project, project => project.comments)
    @JoinColumn({name: 'projectId'})
    public project: Project
}
