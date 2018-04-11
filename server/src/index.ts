import {app} from './app'
import {createConnection, getRepository} from 'typeorm'
import {User} from './entity/User'
import {hash} from 'bcryptjs'

createConnection()
    .then(async () => {
        app.listen(process.env.PORT || 8080)
        const hashedPassword = await hash('password', 12)

        await getRepository(User)
            .insert({
                username: 'pre_created',
                password: hashedPassword,
                body: '',
            })

    })
    .catch(error => {
        console.error(error)
        process.exit(-1)
    })
