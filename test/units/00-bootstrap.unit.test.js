require('dotenv').config();

describe('Units tests', () => {
  require('./01-client-configuration.unit.test');
  require('./02-request-payload.unit.test');
});