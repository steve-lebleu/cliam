

require('dotenv').config();
console.log('process.env', process.env);
describe('E2e tests', () => {
  require('./01-smtp-mail-sending.e2e.test');
  require('./02-api-mail-sending.e2e.test');
});