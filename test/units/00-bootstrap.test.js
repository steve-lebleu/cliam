require('dotenv').config();

describe('Units tests', () => {
  require('./01-client-configuration.test');
  require('./02-request-payload.test');
});