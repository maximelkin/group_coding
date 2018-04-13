require('ts-node').register()
const testSetup = require('./clearDatabase.ts')

module.exports =  async () => {
    await testSetup.default()
}
