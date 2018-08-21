import 'reflect-metadata'

import {app} from './app'
import {createConnection} from 'typeorm'

createConnection()
    .then(async () => {
        app.listen(process.env.PORT || 8080)
    })
    .catch(error => {
        console.error(error)
        process.exit(-1)
    })
