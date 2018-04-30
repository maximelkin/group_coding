import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn} from 'typeorm'
import {User} from './User'
import {Placement} from './Placement'
import {Comment} from './Comment'

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public header: string

    @Column({type: 'text'})
    public text: string

    @Column({nullable: false})
    public creatorUsername: string

    @ManyToOne(() => User, creator => creator.createdProjects)
    @JoinColumn({name: 'creatorUsername'})
    public creator: User

    @OneToMany(() => Comment, comment => comment.project)
    public comments: Comment[]

    @OneToMany(() => Placement, placement => placement.project, {
        cascade: true
    })
    public placements: Placement[]
}
