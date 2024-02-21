require('dotenv').config();

const { writeFileSync } = require('fs');

const { cliamrc } = require(process.cwd() + '/test/fixtures');

describe('Units tests', () => {
  beforeEach(() => {
    writeFileSync(`${process.cwd()}/.cliamrc.json`, JSON.stringify(cliamrc, null, 2), { encoding: 'utf-8' });
  });
  require('./01-client-configuration.test');
  require('./02-request-payload.test');
  require('./03-services.test');
  require('./04-transporters.test');
  require('./05-cliam.test');
  require('./06-utils.test');
});