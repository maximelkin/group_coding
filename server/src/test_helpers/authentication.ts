import {SuperTest, Test} from 'supertest'

export async function getCookies<T extends { username: string, password: string }>
(agent: SuperTest<Test>, {username, password}: T) {
    const res = await agent
        .post('/authentication/local')
        .type('json')
        .send({
            username,
            password,
        })

    // @ts-ignore
    const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0])
    return cookies.join(';')
}
