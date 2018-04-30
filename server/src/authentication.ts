import passport = require('koa-passport')
import local = require('passport-local')
import {User} from './entity/User'
import {getRepository} from 'typeorm'
import {compare} from 'bcryptjs'

passport.serializeUser((user: User, done) => {
    done(null, user.username)
})

passport.deserializeUser(async (username, done) => {
    try {
        const userRepository = getRepository(User)
        const user = await userRepository.findOne(username)
        done(null, user)
    } catch (e) {
        console.error(e)
        done(e)
    }
})

passport.use(new local.Strategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    try {
        const userRepository = getRepository(User)

        const user = await userRepository.findOne(username)

        if (!user) {
            return done(null, false)
        }

        const compareResult = await compare(password, user.password)
        if (!compareResult) {
            return done(null, false)
        }
        done(null, user)
    } catch (e) {
        console.error(e)
        done(e)
    }
}))
