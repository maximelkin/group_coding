import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn} from 'typeorm'
import {User} from './User'
import {Placement} from './Placement'

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public header: string

    @Column({type: 'text'})
    public text: string

    @Column()
    public creatorId: string

    @ManyToOne(() => User, creator => creator.createdProjects)
    @JoinColumn()
    public creator: User

    @OneToMany(() => Placement, placement => placement.project, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    public placements: Placement[]
}
