import {Column, Entity, PrimaryColumn, OneToMany} from 'typeorm'
import {Project} from './Project'
import {Placement} from './Placement'
import {ParticipationRequest} from './ParticipationRequest'

@Entity()
export class User {

    @PrimaryColumn()
    public username: string

    @Column()
    public body: string

    @Column('varchar', {
        nullable: true
    })
    public email: string | null

    @Column()
    public password: string

    @OneToMany(() => Project, project => project.creator)
    public createdProjects: Project[]

    @OneToMany(() => Placement, placement => placement.user)
    public placements: Placement[]

    @OneToMany(() => ParticipationRequest, participationRequest => participationRequest.user)
    public participationRequests: ParticipationRequest[]
}
