require('dotenv').config();

describe('E2E tests', () => {
  require('./01-smtp-mail-sending.test');
  require('./02-api-mail-sending.test');
});