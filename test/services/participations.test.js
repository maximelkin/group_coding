const assert = require('assert');
const app = require('../../src/app');

describe('\'participations\' service', () => {
  it('registered the service', () => {
    const service = app.service('participations');

    assert.ok(service, 'Registered the service');
  });
});
