import passport = require('koa-passport')
import local = require('passport-local')
import {User} from './entity/User'
import {getRepository} from 'typeorm'
import {compare} from 'bcryptjs'

declare module 'koa-session' {
    // noinspection JSUnusedGlobalSymbols
    interface Session extends User {
    }
}

const userRepository = getRepository(User)
passport.serializeUser((user: User, done) => {
    done(null, user.username)
})

passport.deserializeUser(async (id, done) => {
    const user = await userRepository.findOneById(id)
    done(null, user)
})

passport.use(new local.Strategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    const user = await userRepository.findOneById(username)
    if (!user) {
        return done(new Error('wrong user'))
    }
    const compareResult = await compare(password, user.password)
    if (!compareResult) {
        return done(new Error('wrong password'))
    }
    done(null, user)
}))
