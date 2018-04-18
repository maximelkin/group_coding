const usernameRe = /^[a-z\d_\-]{1,12}$/
export const userValidator = {
    username(username: any): username is string {
        return typeof username === 'string' && usernameRe.test(username)
    },

    password(password: any): password is string {
        return typeof password === 'string' && password.length < 30 && password.length > 2
    },

    body(body: any): body is string {
        return typeof body === 'string' && body.length < 2000
    },

    email(email: any): email is string {
        return typeof email === 'string' && email.includes('@') && email.length > 3 && email.length < 400
    }

}
