export const placementValidator = {
    placementsLength(a: any) {
        return Array.isArray(a) && a.length > 0 && a.length < 50
    }
}
