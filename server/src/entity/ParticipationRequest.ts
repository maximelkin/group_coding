import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {Placement} from './Placement'
import {User} from './User'

@Entity()
export class ParticipationRequest {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public placementId: number

    @Column({
        nullable: false,
    })
    public username: string

    @ManyToOne(() => Placement, placement => placement.participationRequests)
    @JoinColumn({name: 'placementId'})
    public placement: Placement

    @ManyToOne(() => User, user => user.participationRequests)
    @JoinColumn({name: 'username'})
    public user: User

    @Column('bool', {
        default: false,
    })
    public declined: boolean
}
