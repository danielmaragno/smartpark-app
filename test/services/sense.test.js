const assert = require('assert');
const app = require('../../src/app');

describe('\'sense\' service', () => {
  it('registered the service', () => {
    const service = app.service('sense');

    assert.ok(service, 'Registered the service');
  });
});
