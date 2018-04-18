import {Context} from 'koa'
import {getRepository} from 'typeorm'
import {Placement} from '../entity/Placement'

export const searchController = {
    placements: async (ctx: Context,
                       conditions: {
                           side?: string[], language?: string[], framework?: string[],
                       },
                       {limit, offset, direction}: { limit: number, offset: number, direction?: 'ASC' | 'DESC' }) => {

        const placements = getRepository(Placement)
            .createQueryBuilder('placement')
            .where(
                'placement.username IS null'
            )
            .limit(limit)
            .offset(offset)
            .orderBy('id', direction || 'ASC')

        for (const [name, value] of Object.entries(conditions)) {
            let where = `placement.${name} IN (:${name})`
            if (value!.includes('any')) {
                where = `(${where} OR placement.${name} IS null)`
            }

            placements.andWhere(
                where,
                {[name]: value})
        }

        ctx.body = await placements.getMany()
    }
}
