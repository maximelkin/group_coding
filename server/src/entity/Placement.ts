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
    @ManyToOne(() => Project, project => project.placements)
    @JoinColumn()
    public project: Project

    @Column({
        nullable: true,
    })
    @ManyToOne(() => User, user => user.placements, {
        nullable: true,
    })
    @JoinColumn()
    public user: User | null

    @OneToMany(() => ParticipationRequest, participationRequest => participationRequest.placement)
    public participationRequests: ParticipationRequest[]
}
