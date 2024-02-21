require('dotenv').config();

describe('Units tests', () => {
  require('./01-client-configuration.test');
  require('./02-request-payload.test');
  require('./03-services.test');
  require('./04-transporters.test');
  require('./05-cliam.test');
  require('./06-utils.test');
});