require('dotenv').config();

describe('E2e tests', () => {
  require('./01-smtp-mail-sending.e2e.test');
  require('./02-api-mail-sending.e2e.test');
});