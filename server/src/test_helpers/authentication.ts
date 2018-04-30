import {SuperTest, Test} from 'supertest'

export async function getCookies<T extends { username: string, password: string }>
(agent: SuperTest<Test>, {username, password}: T) {
    const res: any = await agent
        .post('/authentication/local')
        .type('json')
        .send({
            username,
            password,
        })

    const cookies = (res.headers['set-cookie'][0] as string)
        .split(',')
        .map(item => item.split(';')[0])
        .filter(item => item.includes('='))

    // @ts-ignore
    agent.jar.setCookies(cookies)
}
