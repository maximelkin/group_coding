import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Project} from './Project'
import {User} from './User'
import {ParticipationRequest} from './ParticipationRequest'

@Entity()
export class Placement {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public name: string

    @Column({
        nullable: false,
    })
    public projectId: number

    @Column({
        nullable: true,
    })
    public username: string | null

    @Column({
        nullable: true,
    })
    public side: string

    @Column({
        nullable: true,
    })
    public language: string

    @Column({
        nullable: true,
    })
    public framework: string

    @ManyToOne(() => Project, project => project.placements)
    @JoinColumn({name: 'projectId'})
    public project: Project

    @ManyToOne(() => User, user => user.placements, {
        nullable: true,
    })
    @JoinColumn({name: 'username'})
    public user: User | null

    @OneToMany(() => ParticipationRequest, participationRequest => participationRequest.placement, {
        cascadeUpdate: true,
        cascadeInsert: true,
    })
    public participationRequests: ParticipationRequest[]
}
