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

    @Column()
    public projectId: number

    @ManyToOne(() => Project, project => project.placements)
    @JoinColumn()
    public project: Project

    @ManyToOne(() => User, user => user.placements, {
        nullable: true,
    })
    @JoinColumn()
    public user: User | null

    @OneToMany(() => ParticipationRequest, participationRequest => participationRequest.placement, {
        cascadeUpdate: true,
        cascadeInsert: true,
    })
    public participationRequests: ParticipationRequest[]
}
