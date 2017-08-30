const assert = require('assert');
const app = require('../../src/app');

describe('\'taggings\' service', () => {
  it('registered the service', () => {
    const service = app.service('taggings');

    assert.ok(service, 'Registered the service');
  });
});
