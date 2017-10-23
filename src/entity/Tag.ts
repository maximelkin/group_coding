import {Entity, PrimaryColumn, ManyToMany} from 'typeorm'
import {Project} from './Project'

@Entity()
export class Tag {

    @PrimaryColumn()
    public name: string

    @ManyToMany(type => Project, project => project.tags)
    public projects: Project[]
}
