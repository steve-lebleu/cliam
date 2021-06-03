

require('dotenv').config();
process.sdtout('process.env', process.env.EMAIL_FROM);
process.stdout('process.env', process.env.EMAIL_REPLY_TO);
describe('E2e tests', () => {
  require('./01-smtp-mail-sending.e2e.test');
  require('./02-api-mail-sending.e2e.test');
});