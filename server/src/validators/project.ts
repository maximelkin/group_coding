export const projectValidator = {
    header(header: any) {
        return typeof header === 'string' && header.length < 100
    },
    text(text: any) {
        return typeof text === 'string' && text.length < 5000
    }
}
