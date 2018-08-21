import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm'

// group in one file because of circular dependencies

// tslint:disable:max-classes-per-file

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

    @OneToMany(() => Comment, comment => comment.author)
    public comments: Comment[]
}

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
        cascade: ['insert', 'update']
    })
    public placements: Placement[]
}

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
        cascade: ['insert', 'update'],
    })
    public participationRequests: ParticipationRequest[]
}

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
