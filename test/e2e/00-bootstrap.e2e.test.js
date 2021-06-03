

require('dotenv').config();
console.log('process.env', process.env.EMAIL_FROM);
console.log('process.env', process.env.EMAIL_REPLY_TO);
describe('E2e tests', () => {
  require('./01-smtp-mail-sending.e2e.test');
  require('./02-api-mail-sending.e2e.test');
});