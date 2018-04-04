export const commonValidator = {
    nonNegativeNumber(a: any) {
        return typeof a === 'number' && a >= 0
    }
}
